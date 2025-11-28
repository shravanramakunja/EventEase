const Registration = require("../models/Registration");

const savedUser = await Registration.create(req.body);
