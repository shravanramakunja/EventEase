const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.showRegister);
router.post("/register", userController.registerUser);
router.get("/success", (req, res) => res.render("success"));

module.exports = router;
