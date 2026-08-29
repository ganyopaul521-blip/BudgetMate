const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

// FR12 - budgets for a given month/year with current spend per category
const list = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const budgets = await prisma.budget.findMany({
    where: { userId: req.userId, month, year },
    include: { category: true },
  });

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const results = await Promise.all(
    budgets.map(async (budget) => {
      const spendAgg = await prisma.transaction.aggregate({
        where: {
          userId: req.userId,
          categoryId: budget.categoryId,
          type: "expense",
          transactionDate: { gte: start, lt: end },
        },
        _sum: { amount: true },
      });
      const spent = spendAgg._sum.amount || 0;
      return {
        ...budget,
        spent,
        percentUsed: budget.amountLimit > 0 ? Math.round((spent / budget.amountLimit) * 1000) / 10 : 0,
      };
    })
  );

  res.json({ budgets: results, month, year });
});

// FR11 - create or update a monthly category budget (upsert)
const upsert = asyncHandler(async (req, res) => {
  const { categoryId, month, year, amountLimit } = req.body;

  const budget = await prisma.budget.upsert({
    where: { userId_categoryId_month_year: { userId: req.userId, categoryId, month, year } },
    update: { amountLimit },
    create: { userId: req.userId, categoryId, month, year, amountLimit },
    include: { category: true },
  });

  res.status(201).json({ budget });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await prisma.budget.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) {
    res.status(404);
    throw new Error("Budget not found");
  }
  await prisma.budget.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = { list, upsert, remove };
