import { useState } from "react";
import FloatingChatbot from "./FloatingChatbot";

function ReportIssue() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl = "";

      // Upload image to Cloudinary
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "ai_campus_uploads");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dhhei2ult/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.secure_url;
      }

      const userId = localStorage.getItem("userId");

      const response = await fetch(
        "http://localhost:5000/api/issues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            imageUrl,
            studentId: userId,
          }),
        }
      );

      const result = await response.json();

      setMessage(result.message);

      setDescription("");
      setImage(null);
    } catch (error) {
      console.log(error);
      setMessage("Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6 relative">
      
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Report Campus Issue
        </h1>

        <p className="text-gray-500 mb-4 text-center">
          Describe the issue clearly and include the location.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <textarea
            rows="6"
            placeholder="Describe the issue..."
            className="w-full border p-3 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Processing with AI..." : "Submit Issue"}
          </button>

        </form>

        {message && (
          <div className="mt-4 text-green-600 font-semibold">
            {message}
          </div>
        )}

      </div>

      {/* 🤖 Floating chatbot ONLY for Report page */}
      <FloatingChatbot />

    </div>
  );
}

export default ReportIssue;