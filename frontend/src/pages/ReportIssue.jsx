import { useState } from "react";

function ReportIssue() {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [image, setImage] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (image) {
      const formData = new FormData();

      formData.append("file", image);

      formData.append(
        "upload_preset",
        "ai_campus_uploads"
      );

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

    const userId =
      localStorage.getItem("userId");

    const response = await fetch(
      "http://localhost:5000/api/issues",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          title,
          description,
          imageUrl,
          studentId: userId,
        }),
      }
    );

    const result =
      await response.json();

    setMessage(result.message);

    setTitle("");
    setDescription("");
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Report Campus Issue
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Issue Title"
            className="w-full border p-3 rounded-lg"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            rows="5"
            placeholder="Describe the issue..."
            className="w-full border p-3 rounded-lg"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <input
            type="file"
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
          >
            Submit Issue
          </button>
        </form>

        {message && (
          <div className="mt-4 text-green-600 font-semibold">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportIssue;