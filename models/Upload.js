const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    uploaderId: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    ipfsCid: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    fileHash: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    blockchainTx: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["single", "dataset"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
