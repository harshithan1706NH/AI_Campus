import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    const res = await axios.get("http://localhost:5000/api/issues");
    setIssues(res.data);
  };

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === "Pending").length,
    progress: issues.filter(i => i.status === "In Progress").length,
    resolved: issues.filter(i => i.status === "Resolved").length,
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/issues/${id}`, { status });
    fetchIssues();
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>Admin Dashboard</h1>

      {/* STATS */}
      <div style={{ display: "flex", gap: 20 }}>
        <div>Total: {stats.total}</div>
        <div>Pending: {stats.pending}</div>
        <div>In Progress: {stats.progress}</div>
        <div>Resolved: {stats.resolved}</div>
      </div>

      {/* PIE CHART */}
      <div style={{ marginTop: 20 }}>
        <h3>Issue Distribution</h3>
        <pre>
          {JSON.stringify(stats, null, 2)}
        </pre>
      </div>

      {/* ISSUES */}
      {issues.map(issue => (
        <div key={issue._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          
          {issue.imageUrl && (
            <img src={issue.imageUrl} width={200} />
          )}

          <h3>{issue.title}</h3>
          <p>{issue.description}</p>

          <select
            value={issue.status}
            onChange={(e) => updateStatus(issue._id, e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;