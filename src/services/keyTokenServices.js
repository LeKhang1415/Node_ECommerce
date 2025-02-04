const keyModel = require("../models/keyModel");

class keyTokenServices {
    static createKeyToken = async ({
        userId,
        key_accessToken,
        key_refreshToken,
    }) => {
        try {
            const keyToken = keyModel.create({
                user: userId,
                key_accessToken,
                key_refreshToken,
            });
            return token ? keyToken.key_accessToken : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = keyTokenServices;
