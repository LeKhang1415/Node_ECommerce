const express = require("express");
const AccessControllers = require("../../controllers/accessControllers");

const router = express.Router();

// Shop signUp
router.post("/shop/signup", AccessControllers.signup);

module.exports = router;
