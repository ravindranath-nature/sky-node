// controllers/blockchainController.js
const { ethers } = require("ethers");
const Upload = require("../models/Upload");
const Download = require("../models/DownloadLog");
// ✅ Connect to your local blockchain RPC (Ganache/Hardhat/Anvil)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// ✅ API to get transaction details
exports.getTransactionDetails = async (req, res) => {
  try {
    const { txHash } = req.params;

    // ✅ Fetch transaction details from DB
    const upload = await Upload.findOne({ blockchainTx: txHash });
    if (!upload) {
      return res.status(404).json({ success: false, error: "No upload found for this tx" });
    }
    const downloaderEmails = [];
    const downloads = await Download.find({fileId: upload._id});
    for (const download of downloads) {
      
        downloaderEmails.push(download.userId);
    }

    res.json({
      success: true,
      details: {
        blockchainTx: upload.blockchainTx,
        uploaderId: upload.uploaderId,
        type: upload.type,
        ipfsCid: upload.ipfsCid,
        fileHash: upload.fileHash,
        createdAt: upload.createdAt,
        downloaderEmails
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch transaction" });
  }
};
