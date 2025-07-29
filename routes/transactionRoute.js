// routes/blockchainRoutes.js
const express = require("express");
const router = express.Router();
const { getTransactionDetails } = require("../controllers/transactionController");
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/blockchain/transaction/:txHash
router.get("/:txHash",authMiddleware, getTransactionDetails);

module.exports = router;
