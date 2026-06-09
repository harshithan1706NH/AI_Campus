import { useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!token) return null;

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center">
      <h1 className="font-bold text-xl">
        AI Smart Campus
      </h1>

      <div className="flex gap-3 ml-6">
        {role === "student" && (
          <>
            <button
              onClick={() => navigate("/report")}
              className="bg-white text-blue-600 px-4 py-2 rounded"
            >
              Report Issue
            </button>

            <button
              onClick={() => navigate("/my-issues")}
              className="bg-white text-blue-600 px-4 py-2 rounded"
            >
              My Issues
            </button>
          </>
        )}

        {role === "admin" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-blue-600 px-4 py-2 rounded"
          >
            Dashboard
          </button>
        )}
      </div>

      <button
        onClick={logout}
        className="ml-auto bg-red-500 px-4 py-2 rounded"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;