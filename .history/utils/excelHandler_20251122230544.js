// utils/excelHandler.js
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// Path to Excel file
const filePath = path.join(__dirname, "..", "data", "registrations.xlsx");

// Ensure /data folder exists
const dataFolder = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}

// Standard columns for the sheet
const COLUMNS = [
  "Name",
  "USN",
  "Email",
  "Food",
  "Seat",
  "UniqueID",
  "CheckedIn",
];

// Initialize excel file if not exists
const initExcel = () => {
  if (!fs.existsSync(filePath)) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet([], { header: COLUMNS });
    xlsx.utils.book_append_sheet(wb, ws, "Registrations");
    xlsx.writeFile(wb, filePath);
  }
};

// Read entire sheet safely
const readSheet = () => {
  initExcel();
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets["Registrations"];
  return xlsx.utils.sheet_to_json(ws);
};

// Write all rows back
const writeSheet = (rows) => {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);
};

// Save new registration (prevents duplicate UniqueID)
const saveRegistration = (data) => {
  const rows = readSheet();

  // Prevent duplicate entries
  if (rows.some((row) => row.UniqueID === data.UniqueID)) {
    console.log("Duplicate UniqueID detected. Skipping add.");
    return false;
  }

  rows.push(data);
  writeSheet(rows);
  return true;
};

// Update check-in status
const updateCheckin = (uniqueId) => {
  const rows = readSheet();
  const index = rows.findIndex((r) => r.UniqueID === uniqueId);

  if (index === -1) return false;

  rows[index].CheckedIn = "Yes";
  writeSheet(rows);
  return true;
};

// Export all rows
const getAll = () => readSheet();

module.exports = {
  saveRegistration,
  updateCheckin,
  getAll,
};
