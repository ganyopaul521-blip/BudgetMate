const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

function monthRange(month, year) {
  return { start: new Date(year, month - 1, 1), end: new Date(year, month, 1) };
}

async function sumForRange(userId, type, start, end) {
  const agg = await prisma.transaction.aggregate({
    where: { userId, type, transactionDate: { gte: start, lt: end } },
    _sum: { amount: true },
  });
  return agg._sum.amount || 0;
}

// FR19 - dashboard: balance, recent transactions, budget status for a given
// month (defaults to the current month when no query params are given).
const dashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();
  const { start, end } = monthRange(month, year);

  const [totalIncome, totalExpense, recentTransactions, budgets] = await Promise.all([
    sumForRange(req.userId, "income", start, end),
    sumForRange(req.userId, "expense", start, end),
    prisma.transaction.findMany({
      where: { userId: req.userId },
      include: { category: true },
      orderBy: { transactionDate: "desc" },
      take: 5,
    }),
    prisma.budget.findMany({ where: { userId: req.userId, month, year }, include: { category: true } }),
  ]);

  const budgetStatus = await Promise.all(
    budgets.map(async (budget) => {
      const agg = await prisma.transaction.aggregate({
        where: {
          userId: req.userId,
          categoryId: budget.categoryId,
          type: "expense",
          transactionDate: { gte: start, lt: end },
        },
        _sum: { amount: true },
      });
      const spent = agg._sum.amount || 0;
      return {
        categoryId: budget.categoryId,
        categoryName: budget.category.name,
        amountLimit: budget.amountLimit,
        spent,
        percentUsed: budget.amountLimit > 0 ? Math.round((spent / budget.amountLimit) * 1000) / 10 : 0,
      };
    })
  );

  res.json({
    month,
    year,
    balance: { totalIncome, totalExpense, net: totalIncome - totalExpense },
    recentTransactions,
    budgetStatus,
  });
});

// FR16 - expenditure distribution pie chart for a given month/year
const expenseDistribution = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();
  const { start, end } = monthRange(month, year);

  const transactions = await prisma.transaction.findMany({
    where: { userId: req.userId, type: "expense", transactionDate: { gte: start, lt: end } },
    include: { category: true },
  });

  const byCategory = new Map();
  let total = 0;
  for (const t of transactions) {
    const key = t.category.name;
    byCategory.set(key, (byCategory.get(key) || 0) + t.amount);
    total += t.amount;
  }

  const distribution = Array.from(byCategory.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: total > 0 ? Math.round((amount / total) * 1000) / 10 : 0,
  }));

  res.json({ month, year, total, distribution });
});

// FR17 - rolling six-month income vs expenditure
const monthlyComparison = asyncHandler(async (req, res) => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: d.getMonth() + 1, year: d.getFullYear(), label: d.toLocaleString("en-US", { month: "short", year: "2-digit" }) });
  }

  const results = await Promise.all(
    months.map(async ({ month, year, label }) => {
      const { start, end } = monthRange(month, year);
      const [income, expense] = await Promise.all([
        sumForRange(req.userId, "income", start, end),
        sumForRange(req.userId, "expense", start, end),
      ]);
      return { month, year, label, income, expense };
    })
  );

  res.json({ data: results });
});

// Category spending trend line chart across the past six months
const categoryTrend = asyncHandler(async (req, res) => {
  const { categoryId } = req.query;
  if (!categoryId) {
    res.status(400);
    throw new Error("categoryId is required");
  }

  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: d.getMonth() + 1, year: d.getFullYear(), label: d.toLocaleString("en-US", { month: "short", year: "2-digit" }) });
  }

  const results = await Promise.all(
    months.map(async ({ month, year, label }) => {
      const { start, end } = monthRange(month, year);
      const agg = await prisma.transaction.aggregate({
        where: { userId: req.userId, categoryId, type: "expense", transactionDate: { gte: start, lt: end } },
        _sum: { amount: true },
      });
      return { month, year, label, amount: agg._sum.amount || 0 };
    })
  );

  res.json({ data: results });
});

// FR18 - monthly summary: total income, total expenditure, net balance, top categories
const summary = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();
  const { start, end } = monthRange(month, year);

  const [totalIncome, totalExpense, expenseTransactions] = await Promise.all([
    sumForRange(req.userId, "income", start, end),
    sumForRange(req.userId, "expense", start, end),
    prisma.transaction.findMany({
      where: { userId: req.userId, type: "expense", transactionDate: { gte: start, lt: end } },
      include: { category: true },
    }),
  ]);

  const byCategory = new Map();
  for (const t of expenseTransactions) {
    byCategory.set(t.category.name, (byCategory.get(t.category.name) || 0) + t.amount);
  }
  const topCategories = Array.from(byCategory.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  res.json({
    month,
    year,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    topCategories,
  });
});

module.exports = { dashboard, expenseDistribution, monthlyComparison, categoryTrend, summary };
