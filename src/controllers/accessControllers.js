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
}

module.exports = AuthControllers;
