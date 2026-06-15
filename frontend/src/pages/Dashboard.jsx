import { useEffect, useState } from "react";
import axios from "axios";


function Dashboard() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const res = await axios.get(
          `https://ai-campus-backend-ivxw.onrender.com/api/issues/student/${userId}`
        );

        setIssues(res.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, []);

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <h2>My Issues</h2>

      {issues.length === 0 ? (
        <p>No issues found</p>
      ) : (
        issues.map((i) => (
          <div
            key={i._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{i.title}</h3>
            <p>{i.description}</p>

            <p>
              <b>Status:</b> {i.status}
            </p>

            <p>
              <b>Category:</b> {i.category}
            </p>

            <p>
              <b>Severity:</b> {i.severity}
            </p>

            {i.imageUrl && (
              <img
                src={i.imageUrl}
                alt="issue"
                width="180"
                style={{ borderRadius: "6px" }}
              />
            )}
          </div>
        ))
      )}

      
      
    </div>
  );
}

export default Dashboard;