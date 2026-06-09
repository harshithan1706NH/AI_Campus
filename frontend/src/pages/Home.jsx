import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">

        <h1 className="text-4xl font-bold mb-4">
          AI Smart Campus
        </h1>

        <p className="mb-6 text-gray-600">
          Report and track campus issues
          using AI-powered management.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;