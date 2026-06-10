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
      const res = await axios.get(
        "http://localhost:5000/api/issues"
      );

      setIssues(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (
    id,
    status
  ) => {
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
    pending: issues.filter(
      (i) => i.status === "Pending"
    ).length,
    progress: issues.filter(
      (i) => i.status === "In Progress"
    ).length,
    resolved: issues.filter(
      (i) => i.status === "Resolved"
    ).length,
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-8">

        <div className="bg-white p-4 rounded-xl shadow">
          <h3>Total Issues</h3>
          <p className="text-2xl font-bold">
            {stats.total}
          </p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h3>Pending</h3>
          <p className="text-2xl font-bold">
            {stats.pending}
          </p>
        </div>

        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h3>In Progress</h3>
          <p className="text-2xl font-bold">
            {stats.progress}
          </p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h3>Resolved</h3>
          <p className="text-2xl font-bold">
            {stats.resolved}
          </p>
        </div>

      </div>

      <Analytics stats = {stats}/>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Reported Issues
        </h2>

        {issues.map((issue) => (
          <div
            key={issue._id}
            className="bg-white rounded-xl shadow p-4 mb-4"
          >
            {issue.imageUrl && (
              <img
                src={issue.imageUrl}
                alt="Issue"
                className="w-64 rounded mb-3"
              />
            )}

            <h3 className="text-xl font-bold">
              {issue.title}
            </h3>

            <p className="mt-2">
              <strong>Summary:</strong>{" "}
              {issue.summary}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {issue.location}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {issue.description}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {issue.category}
            </p>

            <p>
              <strong>Severity:</strong>{" "}
              {issue.severity}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {issue.status}
            </p>

            <select
              value={issue.status}
              onChange={(e) =>
                updateStatus(
                  issue._id,
                  e.target.value
                )
              }
              className="border p-2 rounded mt-3"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;