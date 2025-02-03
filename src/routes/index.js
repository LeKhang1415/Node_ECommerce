const express = require("express");
const access = require("./auth");

const router = express.Router();

router.use("/v1/api", access);

module.exports = router;
