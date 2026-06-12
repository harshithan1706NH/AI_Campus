require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const connectDB = require("./db");
const User = require("./models/User");
const Issue = require("./models/Issue");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

/* =========================
   GROQ CHATBOT
========================= */

const getChatbotResponse = async (message, role) => {
  try {
    const systemPrompt =
  role === "admin"
    ? `
You are an ADMIN assistant for a Campus Issue System web application.

STRICT RULES:
- Only use features that exist in THIS application.
- Do NOT invent emails, phone numbers, offices, or external systems.
- Do NOT assume any feature not listed below.
- If something is not available, say: "This feature is not available in this system."

AVAILABLE ADMIN FEATURES:
- View all issues
- Update issue status (Pending / In Progress / Resolved)
- See issue details (description, image, severity, category)

`
    : `
You are a STUDENT assistant for a Campus Issue Reporting web application.

STRICT RULES:
- Only describe features that exist in THIS web app.
- Do NOT invent email support, phone numbers, offices, or external systems.
- Do NOT assume traditional university workflows.
- If user asks something outside system, reply:
  "This feature is not available in this system."

AVAILABLE STUDENT FEATURES:
- Login / Register
- Report issue (description + image upload)
- While reporting issue , mentioning location is must.
- View  issues raised by the user in My issue section
- Track issue status (Pending / In Progress / Resolved)

REPORT ISSUE FLOW:
- User fills description
- User uploads image (must)
- Can track the status of the issue
- Admin updates status later
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log("Groq Error:", error.message);
    return "Unable to respond right now.";
  }
};
const generateIssueDetails = async (description) => {
  try {
    const prompt = `
You are an AI assistant for a Campus Issue Reporting System.

Extract the following information from the issue description.

Return ONLY in this exact format:

Title: ...
Summary: ...
Location: ...

Issue Description:
${description}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You extract issue details and return only the requested format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.log("Groq Issue Extraction Error:", error.message);
    return null;
  }
};

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

/* =========================
   REGISTER (STUDENT ONLY)
========================= */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "student", // ALWAYS student
    });

    await user.save();

    res.json({ message: "Registration Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration Failed" });
  }
});

/* =========================
   LOGIN
========================= */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login Failed" });
  }
});

/* =========================
   CHAT API
========================= */

app.post("/api/chat", async (req, res) => {
  try {
    const { message, role } = req.body;

    const reply = await getChatbotResponse(message, role);

    res.json({ reply });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Chatbot Error" });
  }
});

/* =========================
   ISSUE MODELS
   (keeping your existing logic unchanged)
========================= */

app.post("/api/issues", async (req, res) => {
  try {
    const { description, imageUrl, studentId } = req.body;

    const aiText =
      await generateIssueDetails(description);
      const mlResponse = await axios.post(
  "http://127.0.0.1:8000/predict",
  {
    imageUrl,
    description,
  }
);

const category =
  mlResponse.data.category;

const severity =
  mlResponse.data.severity;

    console.log("Groq Response:");
    console.log(aiText);

    let title = "";
    let summary = "";
    let location = "";

    if (aiText) {
      const lines = aiText.split("\n");

      lines.forEach((line) => {
        if (line.startsWith("Title:")) {
          title = line.replace("Title:", "").trim();
        }

        if (line.startsWith("Summary:")) {
          summary = line.replace("Summary:", "").trim();
        }

        if (line.startsWith("Location:")) {
          location = line.replace("Location:", "").trim();
        }
      });
    }

    const issue = new Issue({
      studentId,
      description,
      imageUrl,

      title,
      summary,
      location,
      
      category,
      severity,

      status: "Pending",
    });

    await issue.save();

    res.json({
      message: "Issue created successfully",
      issue,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Issue creation failed",
    });
  }
});

app.get("/api/issues/student/:studentId", async (req, res) => {
  try {
    const issues = await Issue.find({
      studentId: req.params.studentId,
    });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Error fetching issues" });
  }
});

app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Error fetching issues" });
  }
});

app.put("/api/issues/:id", async (req, res) => {
  try {
    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
});

/* =========================
   SERVER START
========================= */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});