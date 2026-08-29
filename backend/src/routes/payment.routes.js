const express = require("express");
const { budgetCheck, initialize, verify, list } = require("../controllers/payment.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const { budgetCheckSchema, paymentInitSchema } = require("../utils/validators");

const router = express.Router();
router.use(requireAuth);

router.post("/budget-check", validateBody(budgetCheckSchema), budgetCheck);
router.post("/initialize", validateBody(paymentInitSchema), initialize);
router.get("/verify/:reference", verify);
router.get("/", list);

module.exports = router;
