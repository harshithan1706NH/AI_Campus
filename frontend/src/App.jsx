import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIssue from "./pages/ReportIssue";
import MyIssues from "./pages/MyIssues";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./pages/Chatbot";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT */}
        <Route
          path="/report"
          element={
            <ProtectedRoute roleRequired="student">
              <ReportIssue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={<Chatbot />}
        />
        <Route
          path="/my-issues"
          element={
            <ProtectedRoute roleRequired="student">
              <MyIssues />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;