import { useState } from "react";
import axios from "axios";

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I am your Campus Assistant",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);

    const current = message;
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: current,
        role: localStorage.getItem("role"),
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to server" },
      ]);
    }
  };

  return (
    <>
      {/* 🔵 Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#4f46e5",
          color: "white",
          fontSize: "22px",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        💬
      </button>

      {/* 💬 Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#4f46e5",
              color: "white",
              padding: "10px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            Campus Assistant
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.sender === "user" ? "right" : "left",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    background:
                      m.sender === "user" ? "#dbeafe" : "#e5e7eb",
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", padding: "10px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "5px",
                padding: "6px 10px",
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}