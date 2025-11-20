// controllers/adminController.js

exports.login = (req, res) => {
  res.send("Admin login working!");
};

exports.dashboard = (req, res) => {
  res.render("adminDashboard");
};
