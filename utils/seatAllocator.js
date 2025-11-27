// utils/seatAllocator.js
const excelHandler = require("./excelHandler");
const { DEPARTMENTS, ZERO_PAD_LENGTH } = require("./constants");

function pad(n) {
  return String(n).padStart(ZERO_PAD_LENGTH, "0");
}

function pickRandomSeatForDepartment(department) {
  const dep = DEPARTMENTS[department];
  if (!dep) throw new Error("Unknown department: " + department);

  const [min, max] = dep.range;
  const prefix = dep.prefix;

  const allocated = new Set(excelHandler.getAll().map(r => r.Seat));

  // Try random allocation
  for (let i = 0; i < 80; i++) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    const seat = prefix + pad(num);
    if (!allocated.has(seat)) return seat;
  }

  // Fallback (linear)
  for (let i = min; i <= max; i++) {
    const seat = prefix + pad(i);
    if (!allocated.has(seat)) return seat;
  }

  throw new Error("No seats available for " + department);
}

module.exports = { pickRandomSeatForDepartment };
