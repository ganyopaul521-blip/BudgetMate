const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");

// FR15 - notification centre
const list = asyncHandler(async (req, res) => {
  const alerts = await prisma.alert.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unreadCount = await prisma.alert.count({ where: { userId: req.userId, isRead: false } });
  res.json({ alerts, unreadCount });
});

const markRead = asyncHandler(async (req, res) => {
  const existing = await prisma.alert.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.userId) {
    res.status(404);
    throw new Error("Alert not found");
  }
  const alert = await prisma.alert.update({ where: { id: req.params.id }, data: { isRead: true } });
  res.json({ alert });
});

const markAllRead = asyncHandler(async (req, res) => {
  await prisma.alert.updateMany({ where: { userId: req.userId, isRead: false }, data: { isRead: true } });
  res.status(204).send();
});

module.exports = { list, markRead, markAllRead };
