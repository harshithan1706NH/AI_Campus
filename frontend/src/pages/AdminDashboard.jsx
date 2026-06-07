import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/issues"
      );

      setIssues(response.data);
    } catch (error) {
      console.log(error);
    }
  };

 return (
  <div style={{ padding: "20px" }}>
    <h1>Admin Dashboard</h1>

    {issues.map((issue) => (
      <div
        key={issue._id}
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}
      >
        <h3>{issue.title}</h3>

        <p>{issue.description}</p>

        <small>
          {new Date(issue.createdAt).toLocaleString()}
        </small>
      </div>
    ))}
  </div>
);
}

export default AdminDashboard;