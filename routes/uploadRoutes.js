const express = require("express");
const router = express.Router();
const { getAllUploads } = require("../controllers/uploadController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Fetch all uploaded files
router.get("/all", authMiddleware, getAllUploads);

module.exports = router;
