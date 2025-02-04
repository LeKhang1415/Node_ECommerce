const express = require("express");
const access = require("./access");

const router = express.Router();

router.use("/v1/api", access);

module.exports = router;
