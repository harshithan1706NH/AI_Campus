import { useEffect, useState } from "react";
import axios from "axios";

function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      const userId =
        localStorage.getItem("userId");

      const res = await axios.get(
        `https://ai-campus-backend-ivxw.onrender.com/api/issues/student/${userId}`
      );

      setIssues(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 className="p-6">
        Loading...
      </h2>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        My Issues
      </h1>

      {issues.length === 0 ? (
        <p>No issues reported yet.</p>
      ) : (
        issues.map((issue) => (
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
              <h3 className="text-xl font-bold mb-1">
  {issue.title}
</h3>

<p className="text-gray-500 mb-2">
  📍 {issue.location}
</p>

<p className="mb-3 text-gray-700">
  {issue.summary}
</p>

<p className="mb-3">
  <strong>Description:</strong>{" "}
  {issue.description}
</p>

<div className="flex gap-2 flex-wrap">

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
            
          </div>
        ))
      )}
    </div>
  );
}

export default MyIssues;