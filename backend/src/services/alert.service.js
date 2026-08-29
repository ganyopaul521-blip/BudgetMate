const prisma = require("../lib/prisma");

const WARNING_THRESHOLD = 0.8;
const EXCEEDED_THRESHOLD = 1.0;

/**
 * FR13/FR14 - After an expense transaction is saved, check the user's budget for that
 * category/month and generate an alert once spending crosses 80% or 100% of the limit.
 * Runs the two lookups + threshold calc described in Sequence Diagram 2 (Budget Alert Trigger).
 */
async function checkBudgetThreshold({ userId, categoryId, transactionDate }) {
  const date = new Date(transactionDate);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const budget = await prisma.budget.findUnique({
    where: { userId_categoryId_month_year: { userId, categoryId, month, year } },
  });
  if (!budget) return null;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const spendAgg = await prisma.transaction.aggregate({
    where: {
      userId,
      categoryId,
      type: "expense",
      transactionDate: { gte: start, lt: end },
    },
    _sum: { amount: true },
  });

  const totalSpend = spendAgg._sum.amount || 0;
  const percentUsed = totalSpend / budget.amountLimit;

  let alertType = null;
  if (percentUsed >= EXCEEDED_THRESHOLD) alertType = "exceeded";
  else if (percentUsed >= WARNING_THRESHOLD) alertType = "warning";

  if (!alertType) return null;

  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  const alert = await prisma.alert.create({
    data: {
      userId,
      categoryId,
      categoryName: category ? category.name : "Unknown",
      alertType,
      percentUsed: Math.round(percentUsed * 1000) / 10, // e.g. 83.3
      isRead: false,
    },
  });

  return alert;
}

module.exports = { checkBudgetThreshold, WARNING_THRESHOLD, EXCEEDED_THRESHOLD };
