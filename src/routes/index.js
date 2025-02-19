const express = require("express");
const access = require("./access");
const product = require("./product");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

// Check apiKey
// router.use(apiKey);

// // Check permission
// router.use(permission("0000"));

router.use("/v1/api", access);
router.use("/v1/api/product", product);

module.exports = router;
