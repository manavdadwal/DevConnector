const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            autoIndex: true,
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        console.log("Error", error);
        // Exit Process with Failure
        process.exit(1);
    }
};

module.exports = connectDB;
