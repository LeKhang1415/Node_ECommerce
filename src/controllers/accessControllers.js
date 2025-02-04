const AccessService = require("../services/accessServices");

class AuthControllers {
    static signup = async (req, res, next) => {
        try {
            return res.status(201).json(await AccessService.signUp(req.body));
        } catch (error) {
            next(err);
        }
    };
}

module.exports = AuthControllers;
