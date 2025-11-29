const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "registrations.xlsx");
const dataFolder = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder, { recursive: true });

const COLUMNS = [
  "Name", "USN", "Email", "Department", "Seat", "Parents", "uniqueId", "CheckedIn"
];

function initExcel() {
  if (!fs.existsSync(filePath)) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet([], { header: COLUMNS });
    xlsx.utils.book_append_sheet(wb, ws, "Registrations");
    xlsx.writeFile(wb, filePath);
  }
}

exports.getAll = () => {
  initExcel();
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets["Registrations"];
  return xlsx.utils.sheet_to_json(ws, { defval: "" });
};

exports.saveRegistration = (data) => {
  const rows = exports.getAll();
  rows.push(data);
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);
};

// tolerant deleteUser: tries different id column names
exports.deleteUser = (id) => {
  const rows = exports.getAll();
  const initialLength = rows.length;

  // Accept both 'uniqueId' and legacy 'UniqueID' or 'uniqueID'
  const newRows = rows.filter(r => {
    if (r.uniqueId && r.uniqueId === id) return false;
    if (r.UniqueID && r.UniqueID === id) return false;
    if (r.uniqueID && r.uniqueID === id) return false;
    if (r.UniqueId && r.UniqueId === id) return false;
    return true; // keep row
  });

  if (newRows.length === initialLength) {
    // nothing deleted
    return false;
  }

  // When writing back, ensure we keep existing keys for other fields.
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(newRows, { header: Object.keys(newRows[0] || {}) });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);

  return true;
};
