const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const Issue = require("./models/Issue"); // 👈 IMPORTANT

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});


// 🔥 STEP 5: THIS IS THE PART YOU ADD HERE
app.post("/api/issues", async (req, res) => {
  try {
    const { title, description } = req.body;

    const newIssue = new Issue({
      title,
      description
    });

    await newIssue.save();

    res.json({
      message: "Issue saved in database 🚀"
    });

  } catch (error) {
  console.log("DB ERROR:", error);
  res.status(500).json({
    message: "Error saving issue"
  });
}
});

// Get all issues
app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find();

    res.json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching issues"
    });
  }
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});