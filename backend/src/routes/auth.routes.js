const express = require("express");
const { register, login, me, updateProfile } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const { registerSchema, loginSchema, updateProfileSchema } = require("../utils/validators");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", requireAuth, me);
router.patch("/me", requireAuth, validateBody(updateProfileSchema), updateProfile);

module.exports = router;
