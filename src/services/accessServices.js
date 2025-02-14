const shopModel = require("../models/shopModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenServices = require("./keyTokenServices");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getIntoData } = require("../utils");
const {
    BadRequestError,
    AuthFailureError,
    ForbiddenError,
} = require("../core/errorResponse");
const { findByEmail } = require("./shopService");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
        // Lấy userId và email từ user object
        const { userId, email } = user;

        // Kiểm tra nếu refreshToken đã được sử dụng trước đó
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId); // Xóa keyStore của user
            throw new ForbiddenError("Có lỗi xảy ra! Vui lòng đăng nhập lại."); // Yêu cầu đăng nhập lại
        }

        // Kiểm tra nếu refreshToken không khớp với token trong DB
        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailureError("Cửa hàng chưa được đăng ký.");

        // Kiểm tra xem shop có tồn tại hay không
        const foundShop = await findByEmail({ email });
        if (!foundShop)
            throw new AuthFailureError("Cửa hàng chưa được đăng ký.");

        // Tạo một cặp token mới (accessToken và refreshToken)
        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );

        // Cập nhật refreshToken mới và lưu refreshToken cũ vào danh sách đã sử dụng
        await keyStore.update({
            $set: {
                refreshToken: tokens.refreshToken, // Cập nhật refreshToken mới
            },
            $addToSet: {
                refreshTokensUsed: refreshToken, // Đánh dấu refreshToken cũ đã được sử dụng
            },
        });

        // Trả về thông tin user và token mới
        return {
            user,
            tokens,
        };
    };

    static login = async ({ password, email, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError("Shop không tồn tại");
        }

        const match = bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError("Lỗi xác thực người dùng");
        }

        const key_accessToken = crypto.randomBytes(64).toString("hex");
        const key_refreshToken = crypto.randomBytes(64).toString("hex");

        const token = await createTokenPair(
            { userId: foundShop._id, email },
            key_accessToken,
            key_refreshToken
        );

        await keyTokenServices.createKeyToken({
            userId: foundShop._id,
            key_accessToken,
            key_refreshToken,
            refreshToken: token.refreshToken,
        });

        return {
            status: "success",
            token,
            data: {
                shop: getIntoData({
                    fields: ["_id", "name", "email"],
                    object: foundShop,
                }),
            },
        };
    };

    static signUp = async ({ name, email, password }) => {
        // Bước 1: Kiểm tra xem email đã tồn tại chưa
        const holderShop = await shopModel.findOne({ email }).lean();

        if (holderShop) {
            throw new BadRequestError("Shop đã tồn tại");
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

            // create token pair
            const token = await createTokenPair(
                { userId: newShop._id, email },
                key_accessToken,
                key_refreshToken
            );

            const keyToken = await keyTokenServices.createKeyToken({
                userId: newShop._id,
                key_accessToken,
                key_refreshToken,
                refreshToken: token.refreshToken,
            });

            if (!keyToken) {
                throw new BadRequestError("Không tạo được token");
            }

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
    };

    static logout = async (keyStore) => {
        const delKey = await keyTokenServices.removeKeyById(keyStore._id);
        return delKey;
    };
}

module.exports = AccessService;
