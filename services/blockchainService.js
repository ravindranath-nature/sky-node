// ✅ blockchain.js helper
import contract from "../config/blockchain.js";

export const uploadSingleImageToBlockchain = async (uploaderId, fileHash) => {
  if (!uploaderId || !fileHash) {
    throw new Error("Uploader ID or file hash cannot be empty");
  }

  // send transaction
  const tx = await contract.uploadSingleImage(uploaderId, fileHash);
  console.log("⏳ Pending TX:", tx.hash);

  // wait for mining here itself
  const receipt = await tx.wait();
  console.log("✅ Mined TX:", receipt.hash);

  return receipt; // return final receipt
};

export const uploadMultipleImagesToBlockchain = async (uploaderId, hashes) => {
  if (!uploaderId || hashes.length === 0) {
    throw new Error("Uploader ID or hashes cannot be empty");
  }

  const tx = await contract.uploadMultipleImages(uploaderId, hashes);
  console.log("⏳ Pending TX:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Mined TX:", receipt.hash);

  return receipt; // return final receipt
};
