export const MAX_IFC_FILE_SIZE_MB = 200;
export const MAX_IFC_FILE_SIZE_BYTES = MAX_IFC_FILE_SIZE_MB * 1024 * 1024;

export function isIfcFile(file: File) {
  return file.name.toLowerCase().endsWith('.ifc');
}

export function isWithinIfcFileSizeLimit(file: File) {
  return file.size <= MAX_IFC_FILE_SIZE_BYTES;
}
