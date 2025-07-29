// routes/blockchainRoutes.js
const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");
const { uploadSingleFile, uploadMultipleFiles } = require("../controllers/blockchainController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// No temp folder → keep files in memory
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Single File
router.post(
  "/upload-single",authMiddleware,
  upload.single("file"),
  body("uploaderId").notEmpty().withMessage("uploaderId required"),
  uploadSingleFile
);

// ✅ Multiple Files
router.post(
  "/upload-multiple",authMiddleware,
  upload.array("files"),
  body("uploaderId").notEmpty().withMessage("uploaderId required"),
  uploadMultipleFiles
);

module.exports = router;
