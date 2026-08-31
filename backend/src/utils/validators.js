const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: passwordSchema,
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  currency: z.string().trim().min(3).max(10).optional(),
});

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Amount must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  transactionDate: z.string().or(z.date()),
  description: z.string().trim().max(500).optional().nullable(),
  paymentMethod: z.enum(["cash", "mobile_money", "bank_transfer", "card", "other"]),
});

const budgetSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  amountLimit: z.number().positive("Limit must be greater than 0"),
});

const categorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  type: z.enum(["income", "expense"]),
  iconRef: z.string().trim().max(50).optional().nullable(),
});

const budgetCheckSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be greater than 0"),
});

const paymentInitSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  description: z.string().trim().max(500).optional().nullable(),
  channel: z.enum(["card", "mobile_money"]),
});

const aiChatSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  interactionId: z.string().trim().min(1).optional().nullable(),
});

const googleAuthSchema = z.object({
  credential: z.string().min(1, "Missing Google credential"),
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: passwordSchema,
});

module.exports = {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  updateProfileSchema,
  transactionSchema,
  budgetSchema,
  categorySchema,
  budgetCheckSchema,
  paymentInitSchema,
  aiChatSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
