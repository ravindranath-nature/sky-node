require("dotenv").config();
const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");

const contractArtifactPath = path.join(
  process.cwd(), 
  "shared/DownloadLogger.json"
);

const DOWNLOAD_CONTRACT_ADDRESS = process.env.DOWNLOAD_CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// Wallet with private key for sending tx
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractJSON = JSON.parse(fs.readFileSync(contractArtifactPath, "utf8"));

// Create contract instance
const downloadLogger = new ethers.Contract(
  DOWNLOAD_CONTRACT_ADDRESS,
  contractJSON.abi,
  wallet
);

module.exports = downloadLogger;
