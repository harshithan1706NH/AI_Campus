const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://harshithan1706_db_user:PBewDqwBHTeWGxM9@cluster0.vrrnmi9.mongodb.net/ai_campus?retryWrites=true&w=majority"
    );

    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error);
  }
};

module.exports = connectDB;