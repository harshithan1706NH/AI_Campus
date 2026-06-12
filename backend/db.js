console.log("db.js loaded");

const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Attempting MongoDB connection...");

  try {
    await mongoose.connect(process.env.MONGO_URI
      
    );

    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
  console.log("MongoDB connection failed:");
  console.log(error);
}
};

module.exports = connectDB;