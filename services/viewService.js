import viewContract from "../config/viewLogger.js";

export const logViewToBlockchain = async (fileId, fileType) => {
  if (!fileId || !fileType) {
    throw new Error("Missing file ID or file type");
  }

  console.log(`⏳ Sending logView TX: ${fileId} (${fileType})`);

  const tx = await viewContract.logView(fileId, fileType);
  console.log("⏳ Pending TX:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ View logged on-chain:", receipt.hash);

  return receipt;
};
