const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");
const claude = require("../services/claude.service");

const MAX_HISTORY = 12;

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
  const { messages } = req.body;
  const trimmed = messages.slice(-MAX_HISTORY);
  const financialContext = await buildFinancialContext(req.userId);

  try {
    const reply = await claude.chat({ messages: trimmed, financialContext });
    res.json({ reply });
  } catch (err) {
    if (err instanceof claude.Anthropic.AuthenticationError) {
      res.status(503);
      throw new Error("The AI assistant isn't configured yet — add a valid ANTHROPIC_API_KEY in backend/.env.");
    }
    if (err instanceof claude.Anthropic.RateLimitError) {
      res.status(429);
      throw new Error("The AI assistant is receiving too many requests right now. Try again shortly.");
    }
    throw err;
  }
});

module.exports = { chatHandler };
