export const validatePDFFile = (file: File): boolean => {
  // Check if it's a PDF
  if (file.type !== "application/pdf") {
    return false;
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return false;
  }

  return true;
};