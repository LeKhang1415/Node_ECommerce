const express = require("express");
const AuthControllers = require("../../controllers/authControllers");

const router = express.Router();

// Shop signUp
router.post("/shop/signup", AuthControllers.signup);

module.exports = router;
