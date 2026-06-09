require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// ================= AI =================

const getAIAnalysis = async (text) => {
try {
const model = genAI.getGenerativeModel({
model: "gemini-1.5-flash",
});


const prompt = `


Return ONLY valid JSON.

{
"category":"Plumbing | Electrical | Cleanliness | Maintenance | General",
"severity":"Low | Medium | High"
}

Issue: ${text}
`;


const result = await model.generateContent(prompt);
const response = await result.response;
const raw = response.text();

return JSON.parse(
  raw.replace(/json|/g, "").trim()
);


} catch (error) {
console.log("AI Error:", error.message);


return {
  category: "General",
  severity: "Low",
};


}
};

// ================= TEST =================

app.get("/", (req, res) => {
res.send("Backend Running");
});

// ================= REGISTER =================

app.post("/api/auth/register", async (req, res) => {
try {
const { name, email, password, role } =
req.body;


const existingUser = await User.findOne({
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

// ================= CREATE ISSUE =================

app.post("/api/issues", async (req, res) => {
try {
const {
title,
description,
imageUrl,
studentId,
} = req.body;


console.log(
  "Creating issue for student:",
  studentId
);

const aiResult =
  await getAIAnalysis(description);

const issue = new Issue({
  studentId,
  title,
  description,
  imageUrl,
  category: aiResult.category,
  severity: aiResult.severity,
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
  console.log(error);

  res.status(500).json({
    message: "Error fetching issues",
  });
}


});

// ================= ALL ISSUES =================

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

const PORT = 5000;

app.listen(PORT, () => {
console.log(
`Server running on port ${PORT}`
);
});
