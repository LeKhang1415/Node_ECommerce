const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AuthService {
    static signUp = async (name, email, password) => {
        try {
            // Bước 1: Kiểm tra xem email đã tồn tại chưa
            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                return {
                    status: "fail",
                    message: "Cửa hàng đã được đăng ký trước đó!", // Thông báo nếu cửa hàng đã đăng ký
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
                const { privateKey, publickey } = crypto.generateKeyPairSync(
                    "rsa",
                    { modulusLength: 4096 }
                );
            }

            return {
                status: "success", // Mã thành công
                message: "Cửa hàng đã được đăng ký thành công!", // Thông báo khi đăng ký thành công
                data: newShop, // Dữ liệu cửa hàng mới
            };
        } catch (error) {
            return {
                status: "error", // Mã lỗi chung
                message:
                    error.message || "Đã xảy ra lỗi trong quá trình đăng ký", // Thông báo lỗi nếu có
            };
        }
    };
}

module.exports = AuthService;
