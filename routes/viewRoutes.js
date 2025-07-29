const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewController");
const authenticate = require("../middlewares/authMiddleware"); // JWT middleware

router.post("/:fileId", authenticate, viewController.handleView);

module.exports = router;
