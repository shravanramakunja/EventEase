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
  "Parents",
  "uniqueId",
  "CheckedIn",
  "Approved"
];

// =====================
// Initialize Excel File
// =====================
function initExcel() {
  if (!fs.existsSync(filePath)) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet([], { header: COLUMNS });
    xlsx.utils.book_append_sheet(wb, ws, "Registrations");
    xlsx.writeFile(wb, filePath);
  }
}

// =====================
// Read All Rows
// =====================
exports.getAll = () => {
  initExcel();
  const wb = xlsx.readFile(filePath);
  const ws = wb.Sheets["Registrations"];
  return xlsx.utils.sheet_to_json(ws, { defval: "" });
};

// =====================
// Save New Registration
// =====================
exports.saveRegistration = (row) => {
  const rows = exports.getAll();
  rows.push(row);

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);
};

// =====================
// UPDATE CHECK-IN
// =====================
exports.updateCheckin = (id) => {
  const rows = exports.getAll();

  const index = rows.findIndex(r =>
    r.uniqueId === id ||
    r.UniqueID === id ||
    r.uniqueID === id ||
    r.UniqueId === id
  );

  if (index === -1) {
    return { ok: false, reason: "not_found" };
  }

  if (rows[index].CheckedIn === "Yes") {
    return { ok: false, reason: "already_checked_in", row: rows[index] };
  }

  rows[index].CheckedIn = "Yes";

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);

  return { ok: true, row: rows[index] };
};

// =====================
// UPDATE APPROVAL
// =====================
exports.updateApproval = (uniqueId, value) => {
  const rows = exports.getAll();
  const idx = rows.findIndex(r =>
    r.uniqueId === uniqueId ||
    r.UniqueID === uniqueId ||
    r.uniqueID === uniqueId ||
    r.UniqueId === uniqueId
  );

  if (idx === -1) return false;

  rows[idx].Approved = value;

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);

  return true;
};

// =====================
// DELETE USER
// =====================
exports.deleteUser = (id) => {
  const rows = exports.getAll();
  const newRows = rows.filter(r => !(
    r.uniqueId === id ||
    r.UniqueID === id ||
    r.uniqueID === id ||
    r.UniqueId === id
  ));

  if (newRows.length === rows.length) return false;

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(newRows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);

  return true;
};
