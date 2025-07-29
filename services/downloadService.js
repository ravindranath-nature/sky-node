import downloadContract from "../config/downloadLogger.js";

export const logDownloadToBlockchain = async ( fileId, fileType) => {
  if ( !fileId || !fileType) {
    throw new Error("Downloader ID, file ID, or file type missing");
  }

  console.log(`⏳ Sending logDownload TX: ${fileId} (${fileType})`);

  // send transaction
  const tx = await downloadContract.logDownload( fileId, fileType);

  console.log("⏳ Pending TX:", tx.hash);

  // wait for mining
  const receipt = await tx.wait();

  console.log("✅ Download logged on-chain:", receipt.hash);

  return receipt;
};
