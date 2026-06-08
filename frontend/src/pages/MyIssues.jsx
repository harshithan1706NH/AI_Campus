import { useEffect, useState } from "react";
import axios from "axios";

function MyIssues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    axios
      .get(`http://localhost:5000/api/issues/student/${userId}`)
      .then((res) => setIssues(res.data))
      .catch(console.log);
  }, []);

  return (
    <div>
      <h2>My Issues</h2>

      {issues.map((issue) => (
        <div key={issue._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          
          {/* IMAGE FIX */}
          {issue.imageUrl && (
            <img
              src={issue.imageUrl}
              alt="issue"
              style={{ width: 200 }}
            />
          )}

          <h3>{issue.title}</h3>
          <p>{issue.description}</p>
          <p>Status: {issue.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyIssues;