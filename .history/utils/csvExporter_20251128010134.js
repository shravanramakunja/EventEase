const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");
const excelHandler = require("./excelHandler");

exports.exportCSV = async () => {
  const data = excelHandler.getAll();
  const csvPath = path.join(__dirname, "..", "data", "registrations.csv");

  const csvWriter = createCsvWriter({
    path: csvPath,
    header: [
      { id: "Name", title: "Name" },
      { id: "USN", title: "USN" },
      { id: "Email", title: "Email" },
      { id: "Department", title: "Department" },
      { id: "Seat", title: "Seat" },
      { id: "Parents", title: "Parents" },  // NEW
      { id: "UniqueID", title: "UniqueID" },
      { id: "CheckedIn", title: "CheckedIn" }
    ]
  });

  await csvWriter.writeRecords(data);
  return csvPath;
};
