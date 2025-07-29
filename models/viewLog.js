const mongoose = require("mongoose");

const viewLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileId: { type: String, required: true },
  fileType: { type: String, required: true },
  txHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Prevent duplicate views by the same user
viewLogSchema.index({ userId: 1, fileId: 1 }, { unique: true });

module.exports = mongoose.model("ViewLog", viewLogSchema);
