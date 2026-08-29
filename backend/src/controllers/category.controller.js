const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

// System categories + this user's own custom categories
const list = asyncHandler(async (req, res) => {
  const { type } = req.query;

  const categories = await prisma.category.findMany({
    where: {
      OR: [{ isSystem: true }, { userId: req.userId }],
      ...(type ? { type } : {}),
    },
    orderBy: { name: "asc" },
  });

  res.json({ categories });
});

const create = asyncHandler(async (req, res) => {
  const { name, type, iconRef } = req.body;

  const category = await prisma.category.create({
    data: { name, type, iconRef: iconRef || null, isSystem: false, userId: req.userId },
  });

  res.status(201).json({ category });
});

const remove = asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({ where: { id: req.params.id } });

  if (!category || category.userId !== req.userId) {
    res.status(404);
    throw new Error("Category not found");
  }
  if (category.isSystem) {
    res.status(400);
    throw new Error("System categories cannot be deleted");
  }

  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = { list, create, remove };
