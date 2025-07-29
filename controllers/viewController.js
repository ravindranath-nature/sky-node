const UploadedFile = require("../models/Upload");
const ViewLog = require("../models/ViewLog");
const viewLogger = require("../services/viewService");

exports.handleView = async (req, res) => {
  const { fileId } = req.params;
  const userId = req.user.email;
  try {
    const fileData = await UploadedFile.findById(fileId);
    if (!fileData) return res.status(404).json({ success: false, error: "File not found" });

    // Only log if view not already recorded
    const alreadyViewed = await ViewLog.findOne({ userId, fileId });
    if (!alreadyViewed) {
      const receipt = await viewLogger.logViewToBlockchain(fileId, fileData.type);

      await ViewLog.create({
        userId,
        fileId,
        fileType: fileData.type,
        txHash: receipt.hash,
      });
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("❌ View log failed:", err.message);
    res.status(500).json({ success: false, error: "Failed to log view" });
  }
};
