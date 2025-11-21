// utils/excelHandler.js
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/registrations.xlsx");

if (!fs.existsSync(filePath)) {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet([]);
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  xlsx.writeFile(wb, filePath);
}

module.exports = {
  addRow(data) {
    const wb = xlsx.readFile(filePath);
    const ws = wb.Sheets["Sheet1"];

    const json = xlsx.utils.sheet_to_json(ws);
    json.push(data);

    const newWs = xlsx.utils.json_to_sheet(json);
    wb.Sheets["Sheet1"] = newWs;

    xlsx.writeFile(wb, filePath);
  },

  getAll() {
    const wb = xlsx.readFile(filePath);
    const ws = wb.Sheets["Sheet1"];
    return xlsx.utils.sheet_to_json(ws);
  },

  updateCheckin(uniqueId) {
    const wb = xlsx.readFile(filePath);
    const ws = wb.Sheets["Sheet1"];
    const data = xlsx.utils.sheet_to_json(ws);

    const index = data.findIndex((entry) => entry.UniqueID === uniqueId);
    if (index === -1) return false;

    data[index].CheckedIn = "Yes";

    const newWs = xlsx.utils.json_to_sheet(data);
    wb.Sheets["Sheet1"] = newWs;
    xlsx.writeFile(wb, filePath);

    return true;
  },
};
