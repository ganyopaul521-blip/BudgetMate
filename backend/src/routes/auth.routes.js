const express = require("express");
const {
  register,
  login,
  googleAuth,
  me,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { avatarUpload } = require("../middleware/avatarUpload.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../utils/validators");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/google", validateBody(googleAuthSchema), googleAuth);
router.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, validateBody(updateProfileSchema), updateProfile);
router.post("/me/avatar", requireAuth, avatarUpload, uploadAvatar);
router.delete("/me/avatar", requireAuth, removeAvatar);

module.exports = router;
