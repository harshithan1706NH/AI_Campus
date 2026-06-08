require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const Issue = require("./models/Issue");
const User = require("./models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

<<<<<<< HEAD
=======
// ---------------- GEMINI SETUP ----------------

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

<<<<<<< HEAD
// ================= HEALTH CHECK =================
=======
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

    return JSON.parse(
      raw.replace(/```json|```/g, "").trim()
    );

  } catch (error) {
    console.log(
      "AI ERROR (fallback used):",
      error.message
    );

    return {
      category: "General",
      severity: "Low",
    };
  }
};

// ---------------- TEST ROUTE ----------------

>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});
<<<<<<< HEAD
=======

// ---------------- REGISTER ----------------
>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0

// ================= AUTH =================

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

<<<<<<< HEAD
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
=======
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );
>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0

    const user = new User({
      name,
      email,
<<<<<<< HEAD
      password: hashed,
=======
      password: hashedPassword,
>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0
      role,
    });

    await user.save();

<<<<<<< HEAD
    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Register error" });
  }
});
=======
    res.json({
      message: "Registration Successful",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Registration Failed",
    });
  }
});

// ---------------- LOGIN ----------------

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      "secretkey",
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login Successful",
      token,
      role: user.role,
      name: user.name,
      userId: user._id,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login Failed",
    });
  }
});

// ---------------- CREATE ISSUE ----------------
>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0

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
<<<<<<< HEAD
    const { title, description, imageUrl, studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "studentId missing" });
    }

    const issue = new Issue({
=======
    const {
      title,
      description,
      imageUrl,
      studentId,
    } = req.body;

    const aiResult = await getAIAnalysis(
      description
    );

    const newIssue = new Issue({
      studentId,
>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0
      title,
      description,
      imageUrl,
      studentId,   // ✅ NOW STORED PROPERLY
      status: "Pending",
    });

    await issue.save();

<<<<<<< HEAD
    res.json({ message: "Issue created", issue });
  } catch (err) {
    res.status(500).json({ message: "Issue error" });
=======
    res.json({
      message:
        "Issue processed successfully 🚀",
      aiResult,
    });

  } catch (error) {
    console.log(
      "SERVER ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Failed to create issue",
    });
>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0
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
<<<<<<< HEAD
    const pending = await Issue.countDocuments({ status: "Pending" });
    const inProgress = await Issue.countDocuments({ status: "In Progress" });
    const resolved = await Issue.countDocuments({ status: "Resolved" });

    res.json({ pending, inProgress, resolved });
=======
    const issues = await Issue.find();

    res.json(issues);

>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0
  } catch (error) {
    res.status(500).json({ message: "Stats error" });
  }
});

<<<<<<< HEAD
// UPDATE STATUS
=======
// ---------------- GET STUDENT ISSUES ----------------

app.get(
  "/api/issues/student/:studentId",
  async (req, res) => {
    try {
      const issues = await Issue.find({
        studentId: req.params.studentId,
      });

      res.json(issues);

    } catch (error) {
      res.status(500).json({
        message:
          "Error fetching student issues",
      });
    }
  }
);

// ---------------- UPDATE STATUS ----------------

>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0
app.put("/api/issues/:id", async (req, res) => {
  const updated = await Issue.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

<<<<<<< HEAD
  res.json(updated);
=======
    const updatedIssue =
      await Issue.findByIdAndUpdate(
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
>>>>>>> 9728afd17058296c3b0c227c29c47d46621ff7d0
});

// ================= SERVER =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});