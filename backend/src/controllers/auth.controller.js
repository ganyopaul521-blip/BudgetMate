const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");
const { signSessionToken } = require("../utils/token");

function toPublicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    currency: user.currency,
    createdAt: user.createdAt,
  };
}

// FR01 - register
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { fullName, email, passwordHash },
  });

  const token = signSessionToken(user.id);
  res.status(201).json({ token, user: toPublicUser(user) });
});

// FR02 - login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = signSessionToken(user.id);
  res.json({ token, user: toPublicUser(user) });
});

// current authenticated user
const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ user: toPublicUser(user) });
});

// FR04 - update profile
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, currency } = req.body;

  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== req.userId) {
      res.status(409);
      throw new Error("Email already in use by another account");
    }
  }

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: {
      ...(fullName ? { fullName } : {}),
      ...(email ? { email } : {}),
      ...(currency ? { currency } : {}),
    },
  });

  res.json({ user: toPublicUser(user) });
});

module.exports = { register, login, me, updateProfile };
