export function bytesToDisplaySize(bytes: string | number | undefined) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (typeof bytes === "string") {
    bytes = parseInt(bytes);
  }
  if (!bytes) {
    return "0 Bytes";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}

export function truncateFileName(fileName: string, maxCharacters: number) {
  if (fileName.length <= maxCharacters) {
    return fileName;
  }
  const extension = fileName.split(".").pop();
  const extensionLength = extension ? extension.length + 1 : 0;
  const truncatedFileName = fileName.slice(0, maxCharacters - extensionLength);
  return truncatedFileName + "..." + extension;
}
