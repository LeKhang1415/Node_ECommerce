const ProductService = require("../services/productService");
const SuccessResponse = require("../core/successResponse");

class ProductControllers {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Tạo sản phẩm mới thành công!",
            metadata: await ProductService.createProduct(
                req.body.product_type,
                req.body
            ),
        }).send(res);
    };
}

module.exports = new ProductControllers();
