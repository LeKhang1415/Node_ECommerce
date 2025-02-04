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

module.exports = app;
