const express = require("express");
const {
  dashboard,
  expenseDistribution,
  monthlyComparison,
  categoryTrend,
  summary,
} = require("../controllers/report.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();
router.use(requireAuth);

router.get("/dashboard", dashboard);
router.get("/expense-distribution", expenseDistribution);
router.get("/monthly-comparison", monthlyComparison);
router.get("/category-trend", categoryTrend);
router.get("/summary", summary);

module.exports = router;
