const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");
const gemini = require("../services/gemini.service");

function monthRangeNow() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 1),
    label: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
  };
}

// Pulls the user's real current-month numbers so the assistant gives grounded,
// specific advice instead of generic budgeting platitudes.
async function buildFinancialContext(userId) {
  const { start, end, label } = monthRangeNow();

  const [incomeAgg, expenseAgg, budgets] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: "income", transactionDate: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "expense", transactionDate: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
    prisma.budget.findMany({
      where: { userId, month: start.getMonth() + 1, year: start.getFullYear() },
      include: { category: true },
    }),
  ]);

  const totalIncome = incomeAgg._sum.amount || 0;
  const totalExpense = expenseAgg._sum.amount || 0;

  const budgetDetails = await Promise.all(
    budgets.map(async (b) => {
      const agg = await prisma.transaction.aggregate({
        where: { userId, categoryId: b.categoryId, type: "expense", transactionDate: { gte: start, lt: end } },
        _sum: { amount: true },
      });
      const spent = agg._sum.amount || 0;
      return {
        categoryName: b.category.name,
        amountLimit: b.amountLimit,
        spent,
        percentUsed: b.amountLimit > 0 ? Math.round((spent / b.amountLimit) * 1000) / 10 : 0,
      };
    })
  );

  return { monthLabel: label, totalIncome, totalExpense, net: totalIncome - totalExpense, budgets: budgetDetails };
}

const chatHandler = asyncHandler(async (req, res) => {
  const { message, interactionId } = req.body;
  const financialContext = await buildFinancialContext(req.userId);

  try {
    const result = await gemini.chat({ message, previousInteractionId: interactionId, financialContext });
    res.json(result);
  } catch (err) {
    // Google returns 400 INVALID_ARGUMENT (not 401) for a missing/bad API key, with the
    // actual reason nested in err.body rather than err.message.
    const errorText = `${err.message || ""} ${err.body || ""}`;
    const isBadKey = err.status === 401 || (err.status === 400 && /api key/i.test(errorText));
    if (isBadKey) {
      res.status(503);
      throw new Error("The AI assistant isn't configured yet — add a valid GEMINI_API_KEY in backend/.env.");
    }
    if (err.status === 429 || err.status === 503) {
      res.status(503);
      throw new Error("The AI assistant is busy right now. Please try again in a moment.");
    }
    if (err.status === 403) {
      res.status(409);
      throw new Error("That didn't go through — please try sending your message again.");
    }
    throw err;
  }
});

module.exports = { chatHandler };
