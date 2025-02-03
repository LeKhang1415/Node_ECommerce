class AuthControllers {
    signup = async (req, res, next) => {
        try {
            return res.status(201).json({
                status: "success",
                data: "",
            });
        } catch (error) {
            next(err);
        }
    };
}

module.exports = AuthControllers;
