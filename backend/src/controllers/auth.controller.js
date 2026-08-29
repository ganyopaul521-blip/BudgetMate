const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const prisma = require("../lib/prisma");
const { signSessionToken } = require("../utils/token");
const { sendPasswordResetEmail } = require("../services/email.service");

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashResetToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

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

// FR03 - request a password reset link
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  // Respond identically whether or not the account exists, so the endpoint
  // can't be used to enumerate registered emails.
  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: hashResetToken(rawToken),
        resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        res.status(503);
        throw new Error(
          "Password reset emails aren't configured yet — add a valid BREVO_API_KEY and a verified BREVO_FROM_EMAIL in backend/.env."
        );
      }
      throw err;
    }
  }

  res.json({ message: "If an account exists for that email, a password reset link has been sent." });
});

// FR03 - complete a password reset
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: { resetTokenHash: hashResetToken(token), resetTokenExpiresAt: { gt: new Date() } },
  });

  if (!user) {
    res.status(400);
    throw new Error("This reset link is invalid or has expired. Please request a new one.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
  });

  res.json({ message: "Password updated. You can now log in with your new password." });
});

module.exports = { register, login, me, updateProfile, forgotPassword, resetPassword };
