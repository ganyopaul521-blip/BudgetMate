const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");
const { checkBudgetThreshold } = require("../services/alert.service");

// FR10 - filterable, paginated transaction list
const list = asyncHandler(async (req, res) => {
  const { type, categoryId, from, to, search, page = "1", pageSize = "20" } = req.query;

  const where = {
    userId: req.userId,
    ...(type ? { type } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(search ? { description: { contains: search, mode: "insensitive" } } : {}),
    ...(from || to
      ? {
          transactionDate: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
  };

  const take = Math.min(Number(pageSize) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { transactionDate: "desc" },
      skip,
      take,
    }),
    prisma.transaction.count({ where }),
  ]);

  res.json({ transactions, total, page: Number(page) || 1, pageSize: take });
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
