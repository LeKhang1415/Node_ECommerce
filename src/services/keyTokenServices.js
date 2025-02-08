const keyModel = require("../models/keyModel");

class KeyTokenService {
    static createKeyToken = async ({
        userId,
        key_accessToken,
        key_refreshToken,
        refreshToken,
    }) => {
        try {
            const filter = { user: userId };
            const update = {
                key_accessToken,
                key_refreshToken,
                refreshTokenUsed: [],
                refreshToken,
            };
            const options = { upsert: true, new: true };

            const tokens = await keyModel.findOneAndUpdate(
                filter,
                update,
                options
            );

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}
module.exports = KeyTokenService;
