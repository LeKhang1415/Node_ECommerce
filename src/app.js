const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const Routes = require("./routes");

const app = express();

// Khởi tạo middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Khởi tạo db
require("./dbs/initMongodb");
const { checkOverload } = require("./helpers/checkConnect");
// checkOverload();

// Khởi tạo routes
app.use("/", Routes);

// Xử lý lỗi
app.use((req, res, next) => {
    const error = new Error("Không tìm thấy");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack,
        message: error.message || "Lỗi hệ thống",
    });
});

module.exports = app;
