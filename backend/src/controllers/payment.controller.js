const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");
const paystack = require("../services/paystack.service");
const { checkBudgetThreshold } = require("../services/alert.service");

function monthRangeFor(date) {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return { month, year, start: new Date(year, month - 1, 1), end: new Date(year, month, 1) };
}

async function projectBudget(userId, categoryId, amount) {
  const { month, year, start, end } = monthRangeFor(new Date());

  const budget = await prisma.budget.findUnique({
    where: { userId_categoryId_month_year: { userId, categoryId, month, year } },
  });

  const spendAgg = await prisma.transaction.aggregate({
    where: { userId, categoryId, type: "expense", transactionDate: { gte: start, lt: end } },
    _sum: { amount: true },
  });
  const spentSoFar = spendAgg._sum.amount || 0;
  const projectedSpend = spentSoFar + amount;

  if (!budget) {
    return { hasBudget: false, spentSoFar, projectedSpend, amountLimit: null, percentProjected: null, level: "ok" };
  }

  const percentProjected = Math.round((projectedSpend / budget.amountLimit) * 1000) / 10;
  let level = "ok";
  if (percentProjected >= 100) level = "exceeded";
  else if (percentProjected >= 80) level = "warning";

  return {
    hasBudget: true,
    spentSoFar,
    projectedSpend,
    amountLimit: budget.amountLimit,
    percentProjected,
    level,
    overBy: percentProjected >= 100 ? Math.round((projectedSpend - budget.amountLimit) * 100) / 100 : 0,
  };
}

// Pre-payment check: called by the frontend as the user fills in the payment form,
// BEFORE any money moves, so they see the projected budget impact up front.
const budgetCheck = asyncHandler(async (req, res) => {
  const { categoryId, amount } = req.body;
  const projection = await projectBudget(req.userId, categoryId, amount);
  res.json(projection);
});

// Registers the payment with Paystack and records a pending Payment row.
const initialize = asyncHandler(async (req, res) => {
  const { categoryId, amount, description, channel } = req.body;

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category || category.type !== "expense" || (category.userId && category.userId !== req.userId)) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  const reference = `bm_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const amountPesewas = Math.round(amount * 100);

  const paystackData = await paystack.initializeTransaction({
    email: user.email,
    amountPesewas,
    reference,
    metadata: { userId: req.userId, categoryId, description: description || "" },
  });

  await prisma.payment.create({
    data: {
      userId: req.userId,
      categoryId,
      amount,
      description: description || null,
      channel,
      status: "pending",
      reference,
    },
  });

  res.status(201).json({
    reference,
    accessCode: paystackData.access_code,
    authorizationUrl: paystackData.authorization_url,
  });
});

// Confirms the payment with Paystack and, on success, records the matching expense
// transaction and runs the same 80%/100% alert check as a manual transaction entry.
const verify = asyncHandler(async (req, res) => {
  const { reference } = req.params;

  const payment = await prisma.payment.findUnique({ where: { reference } });
  if (!payment || payment.userId !== req.userId) {
    res.status(404);
    throw new Error("Payment not found");
  }

  if (payment.status === "success") {
    const transaction = payment.transactionId
      ? await prisma.transaction.findUnique({ where: { id: payment.transactionId }, include: { category: true } })
      : null;
    return res.json({ payment, transaction, alert: null });
  }

  const result = await paystack.verifyTransaction(reference);

  if (result.status !== "success") {
    const failed = await prisma.payment.update({ where: { reference }, data: { status: "failed" } });
    res.status(402);
    return res.json({ payment: failed, transaction: null, alert: null, message: "Payment was not successful" });
  }

  const transactionDate = new Date();
  const transaction = await prisma.transaction.create({
    data: {
      userId: req.userId,
      type: "expense",
      amount: payment.amount,
      categoryId: payment.categoryId,
      transactionDate,
      description: payment.description || "Payment via Paystack",
      paymentMethod: payment.channel,
    },
    include: { category: true },
  });

  const alert = await checkBudgetThreshold({
    userId: req.userId,
    categoryId: payment.categoryId,
    transactionDate,
  });

  const updatedPayment = await prisma.payment.update({
    where: { reference },
    data: { status: "success", transactionId: transaction.id },
  });

  res.json({ payment: updatedPayment, transaction, alert });
});

const list = asyncHandler(async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { userId: req.userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({ payments });
});

module.exports = { budgetCheck, initialize, verify, list };
