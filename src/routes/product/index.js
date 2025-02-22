const express = require("express");
const productControllers = require("../../controllers/productControllers");
const router = express.Router();
const { handelAsync } = require("../../utils/handelAsync");
const { authentication } = require("../../auth/authUtils");

// Xác thực người dùng
router.use(authentication);

// Định tuyến API để tạo sản phẩm
router.post("/", handelAsync(productControllers.createProduct));

router.get("/drafts/all", asyncHandler(productControllers.getAllDraftsForShop));

module.exports = router;
