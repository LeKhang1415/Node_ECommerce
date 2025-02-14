const JWT = require("jsonwebtoken");
const handelAsync = require("../utils/handelAsync");

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, key_accessToken, key_refreshToken) => {
    // Tạo accessToken
    const accessToken = await JWT.sign(payload, key_accessToken, {
        expiresIn: "2 days",
    });

    // Tạo refreshToken
    const refreshToken = await JWT.sign(payload, key_refreshToken, {
        expiresIn: "7 days",
    });

    // Xác thực accessToken bằng key_accessToken
    JWT.verify(accessToken, key_accessToken, (err, decode) => {
        if (err) {
            console.error(`error verify:: `, err);
        } else {
            console.log(`decode verify:: `, decode);
        }
    });

    return { accessToken, refreshToken };
};

const authentication = asyncHandler(async (req, res, next) => {
    // 1. Lấy userId từ header của request
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId)
        throw new AuthFailureError("Yêu cầu không hợp lệ: Thiếu userId");

    // 2. Tìm kiếm keyStore tương ứng với userId
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Không tìm thấy thông tin keyStore");

    // Xử lý trường hợp request chứa refreshToken
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.key_refreshToken);

            // Kiểm tra userId trong refreshToken có hợp lệ không
            if (userId !== decodeUser.userId)
                throw new AuthFailureError("UserId không hợp lệ");

            // Lưu thông tin vào request
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;

            return next();
        } catch (error) {
            throw error;
        }
    }

    // 3. Lấy accessToken từ header của request
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Yêu cầu không hợp lệ");

    try {
        // 4. Xác minh accessToken bằng publicKey từ keyStore
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

        // 5. Kiểm tra userId trong token có khớp với userId từ request hay không
        if (userId !== decodeUser.userId)
            throw new AuthFailureError("UserId không hợp lệ");

        // 6. Lưu keyStore vào request để sử dụng sau này
        req.keyStore = keyStore;

        // 7. Gọi next() để chuyển sang middleware tiếp theo
        return next();
    } catch (error) {
        throw error;
    }
});

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, verifyJWT };
