import { useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🔥 NOT LOGGED IN → NO NAVBAR LINKS (HOME ONLY CENTER UI)
  if (!token) return null;

  return (
    <nav style={{ padding: "10px", display: "flex", gap: "10px" }}>
      
      {role === "student" && (
        <>
          <button onClick={() => navigate("/report")}>
            Report Issue
          </button>

          <button onClick={() => navigate("/my-issues")}>
            My Issues
          </button>
        </>
      )}

      {role === "admin" && (
        <button onClick={() => navigate("/dashboard")}>
          Admin Dashboard
        </button>
      )}

      <button onClick={logout} style={{ marginLeft: "auto" }}>
        Logout
      </button>

    </nav>
  );
}

export default Navbar;