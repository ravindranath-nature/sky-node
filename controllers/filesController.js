const User = require("../models/User");
const File = require("../models/Upload");
const Download = require("../models/DownloadLog");
const view = require("../models/ViewLog");
const getFilesSummary = async (req, res) => {
  try {
    const totalFiles = await File.countDocuments({});
    const totalImages = await File.countDocuments({ type: "single" });
    const totalDatasets = await File.countDocuments({ type: "dataset" });
    const totalUsers = await User.countDocuments({});
    const totalViews = await view.countDocuments({});
    const totalDownloads = await Download.countDocuments({});
    res.json({
      success: true,
      totalFiles,
      totalImages,
      totalDatasets,
      totalUsers,
      totalViews,
      totalDownloads
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ success: false, message: "Failed to fetch summary" });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await File.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      files,
    });
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ success: false, message: "Failed to fetch files" });
  }
};

//get views and downlaod for a particular file
const getImpression = async (req, res) => {
  try {
    const { fileId } = req.params;
    const views = await view.countDocuments({ fileId });
    const downloads = await Download.countDocuments({ fileId });
    const impression = views + downloads;
    res.json({
      success: true,
      views,
      downloads,
      impression
    });
  } catch (err) {
    console.error("Error fetching views and downloads:", err);
    res.status(500).json({ success: false, message: "Failed to fetch views and downloads" });
  }
}
module.exports = { getFilesSummary, getAllFiles,getImpression };
