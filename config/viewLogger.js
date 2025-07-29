require("dotenv").config();
const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");

const contractArtifactPath = path.join(
  process.cwd(),
  "shared/ViewLogger.json" // <-- compiled contract ABI
);

const VIEW_CONTRACT_ADDRESS = process.env.VIEW_CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractJSON = JSON.parse(fs.readFileSync(contractArtifactPath, "utf8"));

const viewLogger = new ethers.Contract(
  VIEW_CONTRACT_ADDRESS,
  contractJSON.abi,
  wallet
);

module.exports = viewLogger;
