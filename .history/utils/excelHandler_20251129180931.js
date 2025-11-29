const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "registrations.xlsx");
const dataFolder = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder, { recursive: true });

const COLUMNS = [
  "Name", "USN", "Email", "Department", "Seat", "Parents", "uniqueId", "CheckedIn"
];

// Initialize Excel
function initExcel() {
  if (!fs.existsSync(filePath)) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet([], { header: COLUMNS });
    xlsx.utils.book_append_sheet(wb, ws, "registrations");
    xlsx.writeFile(wb, filePath);
  }
}

// Get all rows
exports.getAll = () => {
  initExcel();
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets["registrations"];
  return xlsx.utils.sheet_to_json(ws, { defval: "" });
};

// Save new registration
exports.saveRegistration = (data) => {
  const rows = exports.getAll();
  rows.push(data);
  
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);
};

// UPDATE CHECK-IN
exports.updateCheckin = (uniqueId) => {
  const rows = exports.getAll();

  // Find user with tolerant matching
  const i = rows.findIndex(r =>
    r.uniqueId === uniqueId ||
    r.UniqueID === uniqueId ||
    r.uniqueID === uniqueId ||
    r.UniqueId === uniqueId
  );

  if (i === -1) {
    return { ok: false, reason: "not_found" };
  }

  if (rows[i].CheckedIn === "Yes") {
    return { ok: false, reason: "already_checked_in", row: rows[i] };
  }

  rows[i].CheckedIn = "Yes";

  // Save updated sheet
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);

  return { ok: true, row: rows[i] };
};

// Delete user by ID
exports.deleteUser = (id) => {
  const rows = exports.getAll();
  const initial = rows.length;

  const newRows = rows.filter(r => {
    return !(
      r.uniqueId === id ||
      r.UniqueID === id ||
      r.uniqueID === id ||
      r.UniqueId === id
    );
  });

  if (newRows.length === initial) return false;

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(newRows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "registrations");
  xlsx.writeFile(wb, filePath);

  return true;
};
