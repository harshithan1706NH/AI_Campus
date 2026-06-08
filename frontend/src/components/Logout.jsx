import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 hover:text-red-700"
    >
      Logout
    </button>
  );
}

export default Logout;