const express = require("express");
const AccessControllers = require("../../controllers/accessControllers");
const handelAsync = require("../../utils/handelAsync");

const router = express.Router();

// Shop signUp
router.post("/shop/signup", handelAsync(AccessControllers.signup));

module.exports = router;
