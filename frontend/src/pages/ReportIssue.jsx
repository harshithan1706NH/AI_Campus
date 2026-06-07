import { useState } from "react";

function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();

  let imageUrl = "";

  if (image) {
    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "ai_campus_uploads");

    const cloudinaryResponse = await fetch(
      "https://api.cloudinary.com/v1_1/dhhei2ult/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const cloudinaryData = await cloudinaryResponse.json();

    imageUrl = cloudinaryData.secure_url;
  }

  const response = await fetch(
    "http://localhost:5000/api/issues",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl
      })
    }
  );

  const data = await response.json();

  setMessage(data.message);

  setTitle("");
  setDescription("");
  setImage(null);
};

  return (
    <div>
      <h1>Report Issue</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
          <br /><br />

        <button type="submit">Submit</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default ReportIssue;