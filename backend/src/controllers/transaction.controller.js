const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");
const { checkBudgetThreshold } = require("../services/alert.service");

function buildOrderBy(sortBy, orderDirection) {
  if (sortBy === "amount") return { amount: orderDirection };
  if (sortBy === "category") return { category: { name: orderDirection } };
  return { transactionDate: orderDirection };
}

// FR10 - filterable, paginated, sortable transaction list, plus a real
// aggregate summary for the current filter set (not just the current page).
const list = asyncHandler(async (req, res) => {
  const { type, categoryId, from, to, search, page = "1", pageSize = "20", sortBy = "date", sortOrder = "desc" } = req.query;

  // baseWhere excludes the type filter deliberately: the summary should show
  // the true income/expense split for the active search/category/date scope,
  // not be zeroed out just because the type dropdown is set to one side.
  const baseWhere = {
    userId: req.userId,
    ...(categoryId ? { categoryId } : {}),
    ...(search
      ? {
          OR: [
            { description: { contains: search, mode: "insensitive" } },
            { category: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(from || to
      ? {
          transactionDate: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
  };
  const where = { ...baseWhere, ...(type ? { type } : {}) };

  const take = Math.min(Number(pageSize) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
  const orderDirection = sortOrder === "asc" ? "asc" : "desc";

  const [transactions, total, incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: buildOrderBy(sortBy, orderDirection),
      skip,
      take,
    }),
    prisma.transaction.count({ where }),
    prisma.transaction.aggregate({ where: { ...baseWhere, type: "income" }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { ...baseWhere, type: "expense" }, _sum: { amount: true } }),
  ]);

  const totalIncome = incomeAgg._sum.amount || 0;
  const totalExpense = expenseAgg._sum.amount || 0;

  res.json({
    transactions,
    total,
    page: Number(page) || 1,
    pageSize: take,
    summary: { totalIncome, totalExpense, net: totalIncome - totalExpense, count: total },
  });
});

// FR06/FR07 - record income or expense transaction
const create = asyncHandler(async (req, res) => {
  const { type, amount, categoryId, transactionDate, description, paymentMethod } = req.body;

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category || (category.userId && category.userId !== req.userId)) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: req.userId,
      type,
      amount,
      categoryId,
      transactionDate: new Date(transactionDate),
      description: description || null,
      paymentMethod,
    },
    include: { category: true },
  });

  let alert = null;
  if (type === "expense") {
    alert = await checkBudgetThreshold({
      userId: req.userId,
      categoryId,
      transactionDate: transaction.transactionDate,
    });
  }

  res.status(201).json({ transaction, alert });
});

// FR09 - edit transaction
const update = asyncHandler(async (req, res) => {
  const existing = await prisma.transaction.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  const { type, amount, categoryId, transactionDate, description, paymentMethod } = req.body;

  const transaction = await prisma.transaction.update({
    where: { id: req.params.id },
    data: {
      type,
      amount,
      categoryId,
      transactionDate: new Date(transactionDate),
      description: description || null,
      paymentMethod,
    },
    include: { category: true },
  });

  let alert = null;
  if (type === "expense") {
    alert = await checkBudgetThreshold({
      userId: req.userId,
      categoryId,
      transactionDate: transaction.transactionDate,
    });
  }

  res.json({ transaction, alert });
});

// FR09 - delete transaction
const remove = asyncHandler(async (req, res) => {
  const existing = await prisma.transaction.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  await prisma.transaction.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = { list, create, update, remove };
