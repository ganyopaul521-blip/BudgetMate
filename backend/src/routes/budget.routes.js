const express = require("express");
const { list, upsert, remove } = require("../controllers/budget.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const { budgetSchema } = require("../utils/validators");

const router = express.Router();
router.use(requireAuth);

router.get("/", list);
router.post("/", validateBody(budgetSchema), upsert);
router.delete("/:id", remove);

module.exports = router;
