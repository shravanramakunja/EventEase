// utils/excelHandler.js
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "registrations.xlsx");
const dataFolder = path.join(__dirname, "..", "data");

// Ensure /data folder exists
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder, { recursive: true });

const COLUMNS = [
  "Name",
  "USN",
  "Email",
  "Department",
  "Seat",
  "Parents",
  "UniqueID",
  "CheckedIn"
];

// Initialize Excel if not present
function initExcel() {
  if (!fs.existsSync(filePath)) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet([], { header: COLUMNS });
    xlsx.utils.book_append_sheet(wb, ws, "Registrations");
    xlsx.writeFile(wb, filePath);
  }
}

// Read full sheet
function readSheet() {
  initExcel();
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets["Registrations"];
  return xlsx.utils.sheet_to_json(ws, { defval: "" });
}

// Write full sheet
function writeSheet(rows) {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);
}

// Save new registration
function saveRegistration(data) {
  const rows = readSheet();
  rows.push(data);
  writeSheet(rows);
}

// Update check-in
function updateCheckin(uniqueId) {
  const rows = readSheet();
  const i = rows.findIndex(r => r.UniqueID === uniqueId);

  if (i === -1) {
    return { ok: false, reason: "not_found" };
  }

  if (rows[i].CheckedIn === "Yes") {
    return { ok: false, reason: "already_checked_in", row: rows[i] };
  }

  rows[i].CheckedIn = "Yes";
  writeSheet(rows);

  return { ok: true, row: rows[i] };
}

// Delete user by uniqueId
function deleteUser(uniqueId) {
  const rows = readSheet();
  const newRows = rows.filter(r => r.UniqueID !== uniqueId);

  writeSheet(newRows);

  return rows.length !== newRows.length;
}

module.exports = {
  saveRegistration,
  updateCheckin,
  deleteUser,
  getAll: readSheet,
};
