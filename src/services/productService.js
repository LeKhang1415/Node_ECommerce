const { product, electronic, clothing } = require("../models/productModel");
const { BadRequestError, ForbiddenError } = require("../core/errorResponse");
const { findAllDraftsForShop } = require("../models/repositories/productRepo");

// Định nghĩa class tạo ProductFactory
class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError("Type không hợp lệ");

        return new productClass(payload).createProduct;
    }

    // Query //
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return findAllDraftsForShop({ query, limit, skip });
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
    async createProduct(productId) {
        return await product.create({ ...this, _id: productId });
    }
}

// Định nghĩa lớp con cho các loại sản phẩm khác nhau - Quần áo
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing)
            throw new BadRequestError("Lỗi khi tạo sản phẩm Quần áo");

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError("Lỗi khi tạo sản phẩm");

        return newProduct;
    }
}

// Định nghĩa lớp con cho các loại sản phẩm khác nhau - Điện tử
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newElectronic)
            throw new BadRequestError("Lỗi khi tạo sản phẩm Điện tử");

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("Lỗi khi tạo sản phẩm");

        return newProduct;
    }
}

// Định nghĩa lớp con cho sản phẩm Nội thất
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newFurniture)
            throw new BadRequestError("Lỗi khi tạo sản phẩm Nội thất");

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError("Lỗi khi tạo sản phẩm");

        return newProduct;
    }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
