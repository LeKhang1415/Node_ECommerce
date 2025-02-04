const mongoose = require("mongoose");
const {
    db: { host, port, name },
} = require("../configs/configsMongoDB");
const { countConnect } = require("../helpers/checkConnect");

const connectString =
    process.env.MONGO_URL || `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        try {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });

            await mongoose.connect(connectString, {
                maxPoolSize: 50,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            // countConnect();
            console.log("Kết nối MongoDB thành công!");
            console.log(connectString);
        } catch (err) {
            console.error("Lỗi kết nối MongoDB:", err);
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
