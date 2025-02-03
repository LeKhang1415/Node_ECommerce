const mongoose = require("mongoose");
const os = require("os");

const _SECONDS = 5000;

// Hàm đếm và in ra số kết nối đang hoạt động
const countConnect = () => {
    const connections = mongoose.connections.length;
    console.log(`Số lượng kết nối MongoDB đang hoạt động: ${connections}`);
};

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length; // Đếm số lượng kết nối hiện tại đến MongoDB
        const numCores = os.cpus().length; // Lấy số lõi CPU của hệ thống
        const memoryUsage = process.memoryUsage().rss; // Lấy mức sử dụng bộ nhớ của quá trình hiện tại (RSS - Resident Set Size)

        // Tính toán số kết nối tối đa có thể chấp nhận dựa trên số lõi CPU
        const maxConnections = numCores * 5;

        console.log(`Số kết nối hiện tại: ${numConnection}`);
        console.log(`Mức sử dụng bộ nhớ: ${memoryUsage / 1024 / 1024} MB`);

        // Kiểm tra xem số kết nối hiện tại có vượt quá số kết nối tối đa hay không
        if (numConnection > maxConnections) {
            console.log("Phát hiện quá tải kết nối!");
        }
    }, _SECONDS); // Lặp lại kiểm tra mỗi 5 giây (
};
module.exports = { countConnect, checkOverload };
