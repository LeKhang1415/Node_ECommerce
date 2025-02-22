const ProductService = require("../services/productService");
const SuccessResponse = require("../core/successResponse");

class ProductControllers {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Tạo sản phẩm mới thành công!",
            metadata: await ProductService.createProduct(
                req.body.product_type,
                { ...req.body, product_shop: req.user.UserId }
            ),
        }).send(res);
    };

    // Query //
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Lấy danh sách Draft thành công!",
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    // End Query //
}

module.exports = new ProductControllers();
