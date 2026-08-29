const express = require("express");
const { chatHandler } = require("../controllers/ai.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const { aiChatSchema } = require("../utils/validators");

const router = express.Router();
router.use(requireAuth);

router.post("/chat", validateBody(aiChatSchema), chatHandler);

module.exports = router;
