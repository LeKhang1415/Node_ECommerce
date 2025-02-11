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
    static handleRefreshToken = async (refreshToken) => {
        // Bước 1: Kiểm tra xem refreshToken này đã từng bị sử dụng chưa
        const foundToken = await keyTokenServices.findByRefreshTokenUsed(
            refreshToken
        );

        if (foundToken) {
            // Nếu token đã bị dùng, giải mã để lấy thông tin người dùng
            const { userId, email } = await verifyJWT(
                refreshToken,
                foundToken.key_refreshToken
            );

            await keyTokenServices.deleteKeyById(userId);

            throw new ForbiddenError(
                "Có lỗi đã xảy ra !!! Vui lòng đăng nhập lại"
            );
        }
        // Bước 2: Kiểm tra xem refreshToken có hợp lệ hay không
        const holderToken = await KeyTokenService.findByRefreshToken(
            refreshToken
        );
        if (!holderToken)
            throw new AuthFailureError(
                "Không tìm thấy tài khoản! Vui lòng kiểm tra lại."
            );

        // Bước 3: Xác minh token để lấy thông tin người dùng
        const { userId, email } = await verifyJWT(
            refreshToken,
            holderToken.key_refreshToken
        );

        // Bước 4: Kiểm tra xem email của user có tồn tại trong hệ thống không
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Tài khoản không tồn tại!");

        // Bước 5: Tạo cặp token mới (accessToken + refreshToken)
        const tokens = await createTokenPair(
            userId,
            email,
            holderToken.key_accessToken,
            holderToken.key_refreshToken
        );

        // Bước 6: Cập nhật refreshToken mới vào database
        await holderToken.updateOne({
            $set: { refreshToken: tokens.refreshToken }, // Cập nhật refreshToken mới
            $addToSet: { refreshTokensUsed: refreshToken }, // Lưu lại refreshToken cũ đã dùng để kiểm tra sau này
        });

        // Trả về accessToken và refreshToken mới
        return {
            user: { userId, email },
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
