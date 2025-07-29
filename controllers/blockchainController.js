const crypto = require("crypto");
const fetch = require("node-fetch");
const FormData = require("form-data");
require("dotenv").config();

// ✅ Import blockchain helper functions
const {
  uploadSingleImageToBlockchain,
  uploadMultipleImagesToBlockchain,
} = require("../services/blockchainService");

// ✅ Import MongoDB model
const Upload = require("../models/Upload");

// ✅ Direct IPFS upload using HTTP API
const IPFS_API_URL = process.env.IPFS_API_URL || "http://127.0.0.1:5001";

async function uploadToIpfsSafe(fileBuffer) {
  try {
    const formData = new FormData();
    formData.append("file", fileBuffer);

    const response = await fetch(`${IPFS_API_URL}/api/v0/add`, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `IPFS upload failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log(`[IPFS] Uploaded -> ${result.Hash}`);

    return result.Hash; // Direct API returns 'Hash' not 'cid'
  } catch (error) {
    console.error("[IPFS] Upload error:", error);
    throw error;
  }
}

// ✅ Single file upload + blockchain record
exports.uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const uploaderId = req.user.email; // ✅ Later: extract from JWT auth
    const fileBuffer = req.file.buffer;

    // ✅ Upload to IPFS
    const ipfsCid = await uploadToIpfsSafe(fileBuffer);

    // ✅ Hash file content (SHA256)
    const fileHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    console.log(`[HASH] File -> ${fileHash}`);

    // ✅ Record on blockchain (helper already waits for mining)
    const receipt = await uploadSingleImageToBlockchain(uploaderId, fileHash);

    console.log(`[BLOCKCHAIN] Tx Hash: ${receipt.hash}`);

    // ✅ SAVE to MongoDB after successful upload
    const savedUpload = await Upload.create({
      uploaderId,
      fileName: req.file.originalname,
      ipfsCid, // single CID
      fileHash,
      blockchainTx: receipt.hash,
      blockNumber: receipt.blockNumber,
      type: "single",
    });

    res.json({
      success: true,
      message: "✅ File uploaded to IPFS + hash stored on Blockchain",
      uploaderId,
      ipfsCid,
      ipfsGateway: `http://127.0.0.1:8080/ipfs/${ipfsCid}`,
      fileHash,
      blockchainTx: receipt.hash,
      blockNumber: receipt.blockNumber,
      savedUpload, // return DB entry as well
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Multiple files upload + blockchain record
exports.uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No files uploaded" });
    }
    const totalSize = req.files.reduce((acc, file) => acc + file.size, 0);
    const MAX_DATASET_SIZE = 20 * 1024 * 1024 * 1024;
    console.log(`[UPLOAD] Total size: ${totalSize}`);
    if (totalSize > MAX_DATASET_SIZE) {
        return res.status(400).json({
            error: `Dataset too large. Maximum allowed is 20GB. Your upload was ${(totalSize / 1e9).toFixed(2)}GB.`
        });
    }
const datasetName = req.body.datasetName || "Unnamed Dataset";
    const uploaderId = req.user.email; // ✅ Later: extract from JWT user email
    const uploadedCids = []; // array of objects {fileName, ipfsCid, ipfsGateway}
    const onlyHashes = [];
    const cidArray = []; // ✅ store only the raw CIDs

    console.log(`[UPLOAD] Multiple files count: ${req.files.length}`);

    for (const file of req.files) {
      console.log(`[UPLOAD] Processing file: ${file.originalname}`);

      const ipfsCid = await uploadToIpfsSafe(file.buffer);

      // ✅ Hash file for blockchain
      const fileHash = crypto
        .createHash("sha256")
        .update(file.buffer)
        .digest("hex");

      console.log(`[IPFS] Uploaded ${file.originalname} -> CID: ${ipfsCid}`);
      console.log(`[HASH] SHA256 -> ${fileHash}`);

      uploadedCids.push({
        fileName: file.originalname,
        ipfsCid,
        ipfsGateway: `http://127.0.0.1:8080/ipfs/${ipfsCid}`,
      });

      cidArray.push(ipfsCid); // ✅ just the CID
      onlyHashes.push(fileHash);
    }

    // ✅ Record all file hashes in one blockchain transaction
    const receipt = await uploadMultipleImagesToBlockchain(
      uploaderId,
      onlyHashes
    );

    console.log(`[BLOCKCHAIN] Tx Hash: ${receipt.hash}`);

    // ✅ SAVE one MongoDB document representing the whole DATASET
    const savedDataset = await Upload.create({
      uploaderId,
      fileName: datasetName, // a dataset name
      ipfsCid: cidArray, // ✅ array of CIDs
      fileHash: onlyHashes, // ✅ array of hashes
      blockchainTx: receipt.hash,
      blockNumber: receipt.blockNumber,
      type: "dataset",
    });

    res.json({
      success: true,
      message: "✅ Multiple files uploaded to IPFS + Blockchain recorded",
      uploaderId,
      cidArray,
      uploads: uploadedCids,
      blockchainTx: receipt.hash,
      blockNumber: receipt.blockNumber,
      savedDataset, // return single DB entry for the whole dataset
    });
  } catch (err) {
    console.error("❌ Multi-upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


