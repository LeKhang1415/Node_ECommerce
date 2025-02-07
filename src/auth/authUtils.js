const JWT = require("jsonwebtoken");

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

module.exports = { createTokenPair };
