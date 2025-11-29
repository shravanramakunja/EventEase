const express = require("express");
const router = express.Router();
const checkinController = require("../controllers/checkinController");

router.get("/", (req, res) => {
  res.render("checkinPage");
});

router.post("/submit", checkinController.submitCheckin);
router.post("/manual", checkinController.manualCheckin);


module.exports = router;
