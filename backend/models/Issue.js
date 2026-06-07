const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: String,

  description: String,
  imageUrl: String,

  status: {
    type: String,
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Issue", issueSchema);