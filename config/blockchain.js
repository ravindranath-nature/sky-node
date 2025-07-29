import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// ✅ Load contract ABI dynamically from shared folder
const contractArtifactPath = path.join(
  process.cwd(), 
  "shared/DroneImageUploadAudit.json"
);

const contractJSON = JSON.parse(fs.readFileSync(contractArtifactPath, "utf8"));

// ✅ Setup provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// ✅ Setup wallet signer
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// ✅ Create contract instance
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,  // deployed contract address
  contractJSON.abi,              // ABI from shared JSON
  wallet                         // signer
);

export default contract;
