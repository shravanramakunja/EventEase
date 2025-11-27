// utils/constants.js
module.exports = {
  DEPARTMENTS: {
    "Aeronautical Engineering (AE)": { prefix: "A", range: [1, 40] },
    "Civil Engineering (CE)": { prefix: "A", range: [1, 40] },

    "Aerospace Engineering (ASE)": { prefix: "B", range: [1, 70] },
    "Chemical Engineering (CHE)": { prefix: "B", range: [1, 70] },

    "Electronics and Communication Engineering (ECE)": { prefix: "C", range: [1, 80] },
    "Industrial IOT (IIoT)": { prefix: "C", range: [1, 80] },

    "Computer Science and Engineering and Data Science (CD)": { prefix: "D", range: [1, 220] },
    "Artificial Intelligence and Machine Learning (AI & ML)": { prefix: "D", range: [1, 220] },
    "Computer Science and Design (CG)": { prefix: "D", range: [1, 220] },

    "Computer Science and Engineering (CSE)": { prefix: "E", range: [1, 180] },
    "Information Science and Engineering (ISE)": { prefix: "E", range: [1, 180] },

    "Mechanical Engineering (ME)": { prefix: "A", range: [1, 40] }
  },

  ZERO_PAD_LENGTH: 3 // A012, D187 (3 digits)
};
