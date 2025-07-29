const axios = require("axios");
const archiver = require("archiver");
const UploadedFile = require("../models/Upload");
const DownloadLog = require("../models/DownloadLog");
const downloadLogger = require("../services/downloadService");

exports.handleDownload = async (req, res) => {
  const { fileId } = req.params;
  const userId = req.user.email;

  try {
    // ✅ Fetch metadata
    const fileData = await UploadedFile.findById(fileId);
    if (!fileData) return res.status(404).json({ error: "File not found" });

    // ✅ Check if user already downloaded this file
    const alreadyDownloaded = await DownloadLog.findOne({
      userId,
      fileId
    });

    // ✅ If not already downloaded, log it
    if (!alreadyDownloaded) {
      const receipt = await downloadLogger.logDownloadToBlockchain(
        fileId,
        fileData.type
      );

      await DownloadLog.create({
        userId,
        fileId,
        fileType: fileData.type,
        txHash: receipt.hash,
      });
    } else {
      console.log(`👁️ Skipping duplicate download log for ${userId}`);
    }

    // ✅ Proceed to stream the ZIP
    const datasetCids = Array.isArray(fileData.ipfsCid)
      ? fileData.ipfsCid
      : [fileData.ipfsCid];

    const zipName = `${fileData.fileName || "dataset"}.zip`;
    res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    await Promise.all(
      datasetCids.map(async (cid) => {
        try {
          const ipfsUrl = `http://127.0.0.1:8080/ipfs/${cid}`;
          const response = await axios.get(ipfsUrl, { responseType: "stream" });
          const fileName = `${cid}.png`; // optional: get real name from DB
          archive.append(response.data, { name: fileName });
        } catch (err) {
          console.error(`⚠️ Failed fetching ${cid}:`, err.message);
        }
      })
    );

    archive.finalize();

  } catch (err) {
    console.error("❌ Download failed:", err.message);
    res.status(500).json({ error: "Failed to download file" });
  }
};
