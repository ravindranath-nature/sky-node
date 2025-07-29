const mongoose = require("mongoose");

const DownloadLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileId: { type: String, required: true }, 
  fileType: { type: String, required: true },
  txHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DownloadLog", DownloadLogSchema);
