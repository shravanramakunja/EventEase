// utils/excelHandler.js
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "registrations.xlsx");
const dataFolder = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder, { recursive: true });

const COLUMNS = [
  "Name",
  "USN",
  "Email",
  "Department",
  "Seat",
  "Parents",    // NEW
  "UniqueID",
  "CheckedIn"
];

function initExcel() {
  if (!fs.existsSync(filePath)) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet([], { header: COLUMNS });
    xlsx.utils.book_append_sheet(wb, ws, "Registrations");
    xlsx.writeFile(wb, filePath);
  }
}

function readSheet() {
  initExcel();
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets["Registrations"];
  return xlsx.utils.sheet_to_json(ws, { defval: "" });
}

function writeSheet(rows) {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);
}

function saveRegistration(data) {
  const rows = readSheet();
  rows.push(data);
  writeSheet(rows);
}

function updateCheckin(uniqueId) {
  const rows = readSheet();
  const i = rows.findIndex(r => r.UniqueID === uniqueId);
  if (i === -1) return { ok: false, reason: "not_found" };
  if (rows[i].CheckedIn === "Yes") return { ok: false, reason: "already_checked_in", row: rows[i] };
  rows[i].CheckedIn = "Yes";
  writeSheet(rows);
  return { ok: true, row: rows[i] };
}

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
  getAll: readSheet
};
