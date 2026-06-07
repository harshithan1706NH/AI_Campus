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
  const updateStatus = async (id, status) => {
  try {
    await axios.put(
      `http://localhost:5000/api/issues/${id}`,
      { status }
    );

    fetchIssues();

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

        <p>
        <strong>Status:</strong> {issue.status || "Pending"}
        </p>
        <select
  value={issue.status || "Pending"}
  onChange={(e) =>
    updateStatus(issue._id, e.target.value)
  }
>
  <option value="Pending">Pending</option>
  <option value="In Progress">In Progress</option>
  <option value="Resolved">Resolved</option>
</select>

        <small>
          {new Date(issue.createdAt).toLocaleString()}
        </small>
      </div>
    ))}
  </div>
);
}

export default AdminDashboard;