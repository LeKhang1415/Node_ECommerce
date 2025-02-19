const express = require("express");
const productControllers = require("../../controllers/productControllers");
const router = express.Router();
const { handelAsync } = require("../../utils/handelAsync");
const { authentication } = require("../../auth/authUtils");

// Xác thực người dùng
router.use(authenticationV2);

// Định tuyến API để tạo sản phẩm
router.post("/", handelAsync(productControllers.createProduct));

module.exports = router;
