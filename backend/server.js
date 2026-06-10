require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const connectDB = require("./db");
const User = require("./models/User");
const Issue = require("./models/Issue");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ================= GEMINI CLASSIFICATION =================

const getAIAnalysis = async (text) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Return ONLY valid JSON.

{
  "category":"Plumbing | Electrical | Cleanliness | Maintenance | General",
  "severity":"Low | Medium | High"
}

Issue:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text();

    return JSON.parse(
      raw.replace(/```json|```/g, "").trim()
    );

  } catch (error) {
    console.log("Gemini Error:", error.message);

    return {
      category: "General",
      severity: "Low",
    };
  }
};

// ================= OLLAMA TITLE + SUMMARY =================
const generateTitleSummary = async (
  description
) => {
  try {
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "qwen2.5",
        prompt: `
You are a campus issue assistant.

Return ONLY valid JSON.

{
  "title":"",
  "summary":"",
  "location":""
}

Rules:

1. Generate a short title.
2. Generate a one sentence summary.
3. Extract the location if mentioned.
4. If location is not mentioned return "Unknown".

Issue:
${description}

ONLY RETURN JSON.
`,
        stream: false,
      }
    );

    return JSON.parse(
      response.data.response
    );

  } catch (error) {
    console.log(
      "Ollama Error:",
      error.message
    );

    return {
      title: "Campus Issue",
      summary: description,
      location: "Unknown",
    };
  }
};

const getChatbotResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const prompt = `
You are the assistant for the Smart Campus Issue Reporting and Management System.

SYSTEM FEATURES

Student Features:

* Register and login.
* Report campus issues using a description.
* Upload issue images.
* Automatic title generation.
* Automatic summary generation.
* Automatic location extraction from descriptions.
* View previously reported issues.
* Track issue status.

Issue Status:

* Pending
* In Progress
* Resolved

Admin Features:

* View all reported issues.
* View uploaded images.
* View generated titles and summaries.
* View extracted locations.
* View issue categories.
* View severity levels.
* Update issue status.
* View issue statistics and analytics.

Rules:

* Answer ONLY questions related to this system.
* Never invent features.
* If a feature does not exist, clearly say it is currently unavailable.
* For unrelated questions, reply:
  "Sorry, I can only assist with the Smart Campus Issue Reporting and Management System."

User Question:
${message}
`;

    

    const result =
      await model.generateContent(prompt);

    const response =
      await result.response;

    return response.text();

  } catch (error) {
    console.log(error);

   if (
  error.status === 429 ||
  error.status === 503
) 
{
  return "The assistant is currently busy. Please try again in a few moments.";
}

return "Unable to respond right now.";
  }
};

// ================= TEST =================

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ================= REGISTER =================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } =
      req.body;

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

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

// ================= LOGIN =================

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
      token,
      role: user.role,
      userId: user._id,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login Failed",
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const reply =
      await getChatbotResponse(message);

    res.json({
      reply,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Chatbot Error",
    });
  }
});


// ================= CREATE ISSUE =================

app.post("/api/issues", async (req, res) => {
  try {
    const {
      description,
      imageUrl,
      studentId,
    } = req.body;

    console.log(
      "Creating issue for:",
      studentId
    );

    // Gemini
    const classification =
      await getAIAnalysis(description);

    // Ollama
    const aiContent =
      await generateTitleSummary(
        description
      );
      const issue = new Issue({
  studentId,

  title: aiContent.title,

  summary: aiContent.summary,

  location: aiContent.location,

  description,

  imageUrl,

  category:
    classification.category,

  severity:
    classification.severity,

  status: "Pending",
});
    

    await issue.save();

    res.json({
      message:
        "Issue created successfully",
      issue,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Issue creation failed",
    });
  }
});

// ================= STUDENT ISSUES =================

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
          "Error fetching issues",
      });
    }
  }
);

// ================= ALL ISSUES =================

app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find();

    res.json(issues);

  } catch (error) {
    res.status(500).json({
      message:
        "Error fetching issues",
    });
  }
});

// ================= STATS =================

app.get("/api/issues/stats", async (req, res) => {
  try {
    const pending =
      await Issue.countDocuments({
        status: "Pending",
      });

    const inProgress =
      await Issue.countDocuments({
        status: "In Progress",
      });

    const resolved =
      await Issue.countDocuments({
        status: "Resolved",
      });

    res.json({
      pending,
      inProgress,
      resolved,
    });

  } catch (error) {
    res.status(500).json({
      message: "Stats Error",
    });
  }
});

// ================= UPDATE STATUS =================

app.put("/api/issues/:id", async (req, res) => {
  try {
    const updatedIssue =
      await Issue.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
        }
      );

    res.json(updatedIssue);

  } catch (error) {
    res.status(500).json({
      message: "Update Failed",
    });
  }
});

// ================= SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});