import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>AI Smart Campus Issue Reporting System</h1>

      <p>
        Report campus issues, track complaints, and help maintain the campus efficiently.
      </p>

      <Link to="/login">
        <button>Login</button>
      </Link>

      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
}

export default Home;