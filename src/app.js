const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");

const app = express();

// Khởi tạo middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Khởi tạo db
require("./dbs/initMongodb");
const { checkOverload } = require("./helpers/checkConnect");
checkOverload();

// Khởi tạo routes

// Xử lý lỗi

module.exports = app;
