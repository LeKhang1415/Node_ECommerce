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

// Khởi tạo routes

// Xử lý lỗi

module.export = app;
