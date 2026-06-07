console.log("db.js loaded");

const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Attempting MongoDB connection...");

  try {
    await mongoose.connect(
      "mongodb+srv://harshithan1706_db_user:PBewDqwBHTeWGxM9@cluster0.vrrnmi9.mongodb.net/ai_campus?retryWrites=true&w=majority"
    );

    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
  console.log("MongoDB connection failed:");
  console.log(error);
}
};

module.exports = connectDB;