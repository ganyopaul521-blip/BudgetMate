const express = require("express");
const { list, markRead, markAllRead } = require("../controllers/alert.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();
router.use(requireAuth);

router.get("/", list);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);

module.exports = router;
