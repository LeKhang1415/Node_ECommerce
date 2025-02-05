const apiKeyModel = require("../models/apiKeyModel");

const findById = async (key) => {
    objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
};

module.exports = { findById };
