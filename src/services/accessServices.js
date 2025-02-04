const shopModel = require("../models/shopModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenServices = require("./keyTokenServices");
const { createTokenPair } = require("../auth/authUtils");
const { getIntoData } = require("../utils");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // Bước 1: Kiểm tra xem email đã tồn tại chưa
            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                return {
                    status: "fail",
                    message: "Cửa hàng đã được đăng ký trước đó!",
                };
            }

            // Bước 2: Tạo cửa hàng mới
            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP],
            });

            if (newShop) {
                const key_accessToken = crypto.randomBytes(64).toString("hex");
                const key_refreshToken = crypto.randomBytes(64).toString("hex");

                const keyToken = await keyTokenServices.createKeyToken({
                    userId: newShop._id,
                    key_accessToken,
                    key_refreshToken,
                });

                if (!keyToken) {
                    return {
                        status: "fail",
                        message: "Không tạo được token",
                    };
                }

                // create token pair
                const token = await createTokenPair(
                    { userId: newShop._id, email },
                    key_accessToken,
                    key_refreshToken
                );
                return {
                    status: "success",
                    token,
                    data: {
                        shop: getIntoData({
                            fields: ["_id", "name", "email"],
                            object: newShop,
                        }),
                    },
                };
            }
            return {
                status: "fail",
                data: null,
            };
        } catch (error) {
            return {
                status: "error",
                message:
                    error.message || "Đã xảy ra lỗi trong quá trình đăng ký",
                error: error.stack,
            };
        }
    };
}

module.exports = AccessService;
