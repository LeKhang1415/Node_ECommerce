const app = require("./src/app");
require("dotenv").config();

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
    console.log(`Server chạy tại port ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("Thoát Server");
        // đảm bảo chương trình dừng hoàn toàn (không còn tiến trình chạy ngầm).
        process.exit(0);
    });
});
