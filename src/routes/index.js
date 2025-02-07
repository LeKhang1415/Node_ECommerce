const express = require("express");
const access = require("./access");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

// Check apiKey
// router.use(apiKey);

// // Check permission
// router.use(permission("0000"));

router.use("/v1/api", access);

module.exports = router;
