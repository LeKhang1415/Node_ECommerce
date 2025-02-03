const mongoose = require("mongoose");

class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        try {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });

            const connectString = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";

            await mongoose.connect(connectString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            console.log("Kết nối MongoDB thành công!");
        } catch (err) {
            console.error("Lỗi kết nối MongoDB:", err);
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log("Đã ngắt kết nối với MongoDB.");
        } catch (err) {
            console.error("Lỗi khi ngắt kết nối MongoDB:", err);
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongo = Database.getInstance();
module.exports = instanceMongo;