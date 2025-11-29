const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "registrations.xlsx");

const COLUMNS = [
  "Name",
  "USN",
  "Email",
  "Department",
  "Seat",
  "Parents",
  "uniqueId",     // <-- FIXED
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

exports.updateCheckin = (uniqueId) => {
  const rows = exports.getAll();
  const idx = rows.findIndex(r => r.uniqueId === uniqueId);

  if (idx === -1) return { ok: false, reason: "not_found" };
  if (rows[idx].CheckedIn === "Yes") {
    return { ok: false, reason: "already_checked_in", row: rows[idx] };
  }

  rows[idx].CheckedIn = "Yes";

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows, { header: COLUMNS });
  xlsx.utils.book_append_sheet(wb, ws, "Registrations");
  xlsx.writeFile(wb, filePath);

  return { ok: true, row: rows[idx] };
};
