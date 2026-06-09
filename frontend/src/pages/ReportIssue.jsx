import { useState } from "react";

function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    // 🔥 upload image first
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "ai_campus_uploads");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhhei2ult/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      imageUrl = data.secure_url;
    }

    const userId = localStorage.getItem("userId");
    const studentId = localStorage.getItem("userId");
    console.log("Student ID:", studentId);
    const response = await fetch("http://localhost:5000/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        studentId: userId,
      }),
    });

    const result = await response.json();
    setMessage(result.message);
  };

  return (
    <div>
      <h2>Report Issue</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 🔥 IMAGE UPLOAD FIX */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Submit</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default ReportIssue;