const express = require("express");
const { list, create, remove } = require("../controllers/category.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validateBody } = require("../middleware/validate.middleware");
const { categorySchema } = require("../utils/validators");

const router = express.Router();
router.use(requireAuth);

router.get("/", list);
router.post("/", validateBody(categorySchema), create);
router.delete("/:id", remove);

module.exports = router;
