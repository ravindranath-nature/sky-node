const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { handleDownload } = require("../controllers/downloaderController");

// ✅ Route: GET /api/download/:fileId
router.get("/:fileId", authMiddleware, handleDownload);

module.exports = router;
