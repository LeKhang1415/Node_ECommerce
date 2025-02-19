const { product, electronic, clothing } = require("../models/productModel");
const { BadRequestError, ForbiddenError } = require("../core/errorResponse");

// Định nghĩa class tạo ProductFactory
class ProductFactory {
    static createProduct(type, payload) {
        switch (type) {
            case "Clothing":
                Clothing.createProduct(payload);
            case "Electronic":
                Electronics.createProduct(payload);
            default:
                throw new BadRequestError("Type ko hợp lệ");
        }
    }
}

// Định nghĩa class tạo Product
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_type,
        product_shop,
        product_attributes,
        product_quantity,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    }

    // Phương thức tạo sản phẩm mới
    async createProduct() {
        return await product.create(this);
    }
}

// Định nghĩa lớp con cho các loại sản phẩm khác nhau - Quần áo
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing)
            throw new BadRequestError("Lỗi khi tạo sản phẩm Quần áo");

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("Lỗi khi tạo sản phẩm");

        return newProduct;
    }
}

// Định nghĩa lớp con cho các loại sản phẩm khác nhau - Điện tử
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes);
        if (!newElectronic)
            throw new BadRequestError("Lỗi khi tạo sản phẩm Điện tử");

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("Lỗi khi tạo sản phẩm");

        return newProduct;
    }
}

module.exports = ProductFactory;
