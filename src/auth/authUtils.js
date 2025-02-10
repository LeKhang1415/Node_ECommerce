const JWT = require("jsonwebtoken");
const handelAsync = require("../utils/handelAsync");

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
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
    /*
      1 - Kiểm tra xem userId có tồn tại không?
      2 - Lấy accessToken từ headers
      3 - Xác minh accessToken
      4 - Kiểm tra user có tồn tại trong hệ thống không?
      5 - Kiểm tra keyStore có khớp với userId không?
      6 - Nếu tất cả hợp lệ => chuyển sang middleware tiếp theo (next())
    */

    // 1. Lấy userId từ header của request
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId)
        throw new AuthFailureError("Yêu cầu không hợp lệ: Thiếu userId");

    // 2. Tìm kiếm keyStore tương ứng với userId
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Không tìm thấy thông tin keyStore");

    // 3. Lấy accessToken từ header của request
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken)
        throw new AuthFailureError("Yêu cầu không hợp lệ: Thiếu accessToken");

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
        // Nếu có lỗi xảy ra trong quá trình xác minh token, ném lỗi ra để xử lý
        throw error;
    }
});

module.exports = { createTokenPair, authentication };
