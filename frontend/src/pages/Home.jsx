import { useEffect, useState } from "react";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then((data) => setMessage(data));
  }, []);

  return (
    <div>
      <h1>AI Smart Campus</h1>

      <p>Backend says:</p>

      <h2>{message}</h2>
    </div>
  );
}

export default Home;