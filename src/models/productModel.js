const { model, Schema } = require("mongoose"); // Import mongoose

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Định nghĩa Schema chính cho Product
const productSchema = new Schema(
    {
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_description: String,
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        product_attributes: { type: Schema.Types.Mixed, required: true },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// Schema cho Clothing (Quần áo)
const clothingSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
    },
    {
        collection: "clothes",
        timestamps: true,
    }
);

// Schema cho Electronics (Thiết bị điện tử)
const electronicSchema = new Schema(
    {
        manufacturer: { type: String, required: true },
        model: String,
        color: String,
    },
    {
        collection: "electronics",
        timestamps: true,
    }
);

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronics", electronicSchema),
    clothing: model("Clothing", clothingSchema),
};
