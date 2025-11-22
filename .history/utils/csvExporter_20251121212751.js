// utils/csvExporter.js
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");
const excelHandler = require("./excelHandler");

/**
 * Export registrations Excel → CSV
 */
exports.exportCSV = async () => {
  try {
    const data = excelHandler.getAll();

    const csvWriter = createCsvWriter({
      path: path.join(__dirname, "../data/registrations.csv"),
      header: [
        { id: "Name", title: "Name" },
        { id: "USN", title: "USN" },
        { id: "Email", title: "Email" },
        { id: "Food", title: "Food" },
        { id: "Seat", title: "Seat" },
        { id: "UniqueID", title: "UniqueID" },
        { id: "CheckedIn", title: "CheckedIn" },
      ],
    });

    await csvWriter.writeRecords(data);
    return true;
  } catch (err) {
    console.error("CSV Export Error →", err);
    return false;
  }
};
