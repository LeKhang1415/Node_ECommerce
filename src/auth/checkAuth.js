const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
};

const { findById } = require("../services/apiKeyService");

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: "Lỗi truy cập bị từ chối",
            });
        }

        // check objKey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Lỗi truy cập bị từ chối",
            });
        }

        req.objKey = objKey;
        return next();
    } catch (error) {
        next(error);
    }
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Không cho phép truy cập",
            });
        }

        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: "Không cho phép truy cập",
            });
        }
        return next();
    };
};

module.exports = { apiKey, permission };
