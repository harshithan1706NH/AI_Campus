import { useEffect, useState } from "react";
import axios from "axios";
import Analytics from "./Analytics";

function AdminDashboard() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/issues");
      setIssues(res.data);
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

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "Pending").length,
    progress: issues.filter((i) => i.status === "In Progress").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-8">

        <div className="bg-white p-4 rounded-xl shadow">
          <h3>Total Issues</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h3>Pending</h3>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h3>In Progress</h3>
          <p className="text-2xl font-bold">{stats.progress}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h3>Resolved</h3>
          <p className="text-2xl font-bold">{stats.resolved}</p>
        </div>

      </div>

      <Analytics stats={stats} />

      {/* ISSUES LIST */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Reported Issues
        </h2>

        {issues.map((issue) => (
          <div
            key={issue._id}
            className="bg-white rounded-xl shadow p-5 mb-5"
          >

            {/* IMAGE */}
            {issue.imageUrl && (
              <img
                src={issue.imageUrl}
                alt="Issue"
                className="w-64 rounded mb-3"
              />
            )}

            {/* TITLE */}
            <h3 className="text-xl font-bold mb-1">
              {issue.title}
            </h3>

            {/* LOCATION */}
            <p className="text-gray-500 mb-2">
              📍 {issue.location}
            </p>

            {/* SUMMARY */}
            <p className="text-gray-700 mb-3">
              {issue.summary}
            </p>

            {/* DESCRIPTION */}
            <p className="text-sm mb-3">
              <strong>Description:</strong>{" "}
              {issue.description}
            </p>

            {/* BADGES */}
            <div className="flex gap-2 flex-wrap mb-4">

              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                {issue.category}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  issue.severity === "High"
                    ? "bg-red-100 text-red-700"
                    : issue.severity === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {issue.severity}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  issue.status === "Resolved"
                    ? "bg-green-100 text-green-700"
                    : issue.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {issue.status}
              </span>

            </div>

            {/* STATUS UPDATE */}
            <select
              value={issue.status}
              onChange={(e) =>
                updateStatus(issue._id, e.target.value)
              }
              className="border p-2 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;