require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const Issue = require("./models/Issue");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------- GEMINI SETUP ----------------
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// ---------------- AI FUNCTION ----------------

const getAIAnalysis = async (text) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are an AI that classifies campus issues.

Return ONLY valid JSON:
{
  "category": "Plumbing | Electrical | Cleanliness | Maintenance | General",
  "severity": "Low | Medium | High"
}

Rules:
- ONLY JSON
- NO explanation

Issue: ${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text();

    // safer JSON parsing
    return JSON.parse(raw.replace(/```json|```/g, "").trim());

  } catch (error) {
    console.log("AI ERROR (fallback used):", error.message);

    // fallback so backend NEVER breaks
    return {
      category: "General",
      severity: "Low",
    };
  }
};

// ---------------- TEST ROUTE ----------------

app.get("/", (req, res) => {
  res.send("Backend is working 🚀 (Gemini AI enabled)");
});
// ---------------- REGISTER ----------------

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.json({
      message: "Registration Successful"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Registration Failed"
    });
  }
});
// ---------------- CREATE ISSUE ----------------

app.post("/api/issues", async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const aiResult = await getAIAnalysis(description);

    const newIssue = new Issue({
      title,
      description,
      imageUrl,
      category: aiResult.category,
      severity: aiResult.severity,
      status: "Pending",
    });

    await newIssue.save();

    res.json({
      message: "Issue processed successfully 🚀",
      aiResult,
    });

  } catch (error) {
    console.log("SERVER ERROR:", error.message);

    res.status(500).json({
      message: "Failed to create issue",
    });
  }
});

// ---------------- GET ALL ISSUES ----------------

app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching issues",
    });
  }
});

// ---------------- UPDATE STATUS ----------------

app.put("/api/issues/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({
      message: "Error updating status",
    });
  }
});

// ---------------- START SERVER ----------------

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});