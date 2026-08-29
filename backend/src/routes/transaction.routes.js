const express = require("express");
const { list, create, update, remove } = require("../controllers/transaction.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const { transactionSchema } = require("../utils/validators");

const router = express.Router();
router.use(requireAuth);

router.get("/", list);
router.post("/", validateBody(transactionSchema), create);
router.put("/:id", validateBody(transactionSchema), update);
router.delete("/:id", remove);

module.exports = router;
