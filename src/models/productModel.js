const { model, Schema } = require("mongoose"); // Import mongoose
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Định nghĩa Schema chính cho Product
const productSchema = new Schema(
    {
        product_name: { type: String, required: true }, // quan ao
        product_thumb: { type: String, required: true },
        product_description: String,
        product_slug: String, // quan-ao
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        product_attributes: { type: Schema.Types.Mixed, required: true },
        // more
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be below 5.0"],
            set: (val) => Math.round(val * 10) / 10,
        },

        product_variations: { type: Array, default: [] }, // Danh sách biến thể sản phẩm

        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },

        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// Middleware (trước khi lưu vào database)
productSchema.pre("save", function (next) {
    // Chuyển `product_name` thành slug và lưu vào `product_slug`
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

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

// Schema cho Furniture (Quần áo)
const furnitureSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
    },
    {
        collection: "furnitures",
        timestamps: true,
    }
);

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronics", electronicSchema),
    clothing: model("Clothing", clothingSchema),
    furniture: model("Furniture", furnitureSchema),
};
