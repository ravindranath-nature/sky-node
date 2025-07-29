const express = require("express");
const router = express.Router();
const { getFilesSummary, getAllFiles, getImpression } = require("../controllers/filesController");
const authMiddleware = require("../middlewares/authMiddleware"); // if you have token check

// ✅ Fetch summary (datasets, images, users)
router.get("/summary", authMiddleware, getFilesSummary);

// ✅ Fetch all available files
router.get("/", authMiddleware, getAllFiles);
router.get("/impression/:fileId", authMiddleware, getImpression);

module.exports = router;
