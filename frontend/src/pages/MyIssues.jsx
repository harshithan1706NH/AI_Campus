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
        `http://localhost:5000/api/issues/student/${userId}`
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

            <h3 className="text-xl font-bold">
              {issue.title}
            </h3>

            <p>{issue.description}</p>

            <p>
              <strong>Status:</strong>{" "}
              {issue.status}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {issue.category}
            </p>

            <p>
              <strong>Severity:</strong>{" "}
              {issue.severity}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyIssues;