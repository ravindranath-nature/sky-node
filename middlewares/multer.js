const multer = require("multer");
const path = require("path");

const allowedExtensions = [
  ".tif",
  ".tiff",
  ".jp2",
  ".ecw",
  ".img",
  ".sid",
  ".hdf",
  ".nc",
  ".vrt",
  ".kml",
  ".kmz",
  ".grd",
  ".dem",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".flv",
  ".webm",
  ".m4v",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".txt",
  ".csv",
];

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file extension: ${ext}`));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
