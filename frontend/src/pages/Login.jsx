import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userId", res.data.userId);
console.log(
  "Stored User ID:",
  res.data.userId
);
    if (res.data.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/report");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;