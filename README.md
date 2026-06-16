# AI Campus – Smart Issue Reporting System

An AI-powered full-stack web application that allows students to report campus issues using image + text input. The system automatically classifies the issue type and predicts severity using a machine learning model and routes it to an admin dashboard for resolution tracking.

# Live Links
https://your-vercel-link.vercel.app  

# Features

# Student Side
- User registration & login (JWT authentication)
- Report campus issues with:
  - Image upload 
  - Text description
- View submitted issues
- Track issue status (Pending / In Progress / Resolved)

# AI/ML System
- Image + text-based issue classification
- Automatic category prediction (e.g., Furniture, Infrastructure, etc.)
- Severity detection (Low / Medium / High)
- Hugging Face ML API integration

# Admin Panel
- View all reported issues
- Update issue status
- Monitor severity-based prioritization

# Tech Stack

# Frontend
- React.js (Vite)
- Axios
- React Router DOM
- Tailwind CSS 

#  Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication


# Machine Learning
- Python (FastAPI)
- Hugging Face Spaces deployment
- Image + text classification model

# Deployment
- Frontend: Vercel
- Backend: Render
- ML Service: Hugging Face Spaces
