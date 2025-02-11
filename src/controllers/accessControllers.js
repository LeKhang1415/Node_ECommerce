const { CREATED, SuccessResponse } = require("../core/successResponse");
const AccessService = require("../services/accessServices");

class AuthControllers {
    static login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res);
    };

    static signup = async (req, res, next) => {
        new CREATED({
            message: "Đăng kí thành công",
            metadata: await AccessService.signUp(req.body),
        }).send(res);
    };

    static logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Đăng xuất thành công",
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    };

    static handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Lấy token thành công",
            metadata: await AccessService.handleRefreshToken(
                req.body.refreshToken
            ),
        }).send(res);
    };
}

module.exports = AuthControllers;
