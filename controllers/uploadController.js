const Upload = require("../models/Upload");

exports.getAllUploads = async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: uploads.length,
      uploads,
    });
  } catch (err) {
    console.error("❌ Fetch uploads error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
