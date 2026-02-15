import * as XLSX from "xlsx";

/**
 * Converts an array of objects to an Excel workbook and triggers a download.
 * @param data Array of row objects (keys become column headers)
 * @param filename Download filename without extension (e.g. "users-export")
 * @param sheetName Optional sheet name (default "Sheet1")
 */
export function downloadExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  sheetName = "Sheet1"
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
