import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "20px"
    }}>
      
      <h1>AI Smart Campus</h1>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>

    </div>
  );
}

export default Home;