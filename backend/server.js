require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const Issue = require("./models/Issue");
const User = require("./models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ================= AUTH =================

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role,
    });

    await user.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Register error" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  console.log("LOGIN ROUTE HIT");

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// ================= ISSUES =================

// CREATE ISSUE (🔥 FIXED HERE)
app.post("/api/issues", async (req, res) => {
  try {
    const { title, description, imageUrl, studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "studentId missing" });
    }

    const issue = new Issue({
      title,
      description,
      imageUrl,
      studentId,   // ✅ NOW STORED PROPERLY
      status: "Pending",
    });

    await issue.save();

    res.json({ message: "Issue created", issue });
  } catch (err) {
    res.status(500).json({ message: "Issue error" });
  }
});

// GET STUDENT ISSUES
app.get("/api/issues/student/:studentId", async (req, res) => {
  const issues = await Issue.find({
    studentId: req.params.studentId,
  });

  res.json(issues);
});

// GET ALL ISSUES (ADMIN)
app.get("/api/issues", async (req, res) => {
  const issues = await Issue.find();
  res.json(issues);
});

// STATS (PIE CHART)
app.get("/api/issues/stats", async (req, res) => {
  try {
    const pending = await Issue.countDocuments({ status: "Pending" });
    const inProgress = await Issue.countDocuments({ status: "In Progress" });
    const resolved = await Issue.countDocuments({ status: "Resolved" });

    res.json({ pending, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ message: "Stats error" });
  }
});

// UPDATE STATUS
app.put("/api/issues/:id", async (req, res) => {
  const updated = await Issue.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(updated);
});

// ================= SERVER =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});