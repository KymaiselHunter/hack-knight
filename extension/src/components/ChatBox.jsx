import React, { useState } from "react";
import axios from "axios";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const API_KEY = "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"; // 🔴 Replace with your OpenRouter API key

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions", // ✅ Updated endpoint
        {
          model: "openrouter/mistral-7b", // ✅ Change model if needed
          messages: updatedMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "HTTP-Referer": "https://your-extension.com", // ✅ Replace with your actual extension URL
            "X-Title": "Your Chrome Extension",
            "Content-Type": "application/json",
          },
        }
      );

      setMessages([...updatedMessages, response.data.choices[0].message]);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch response.");
    }
  };

  return (
    <div style={{ width: "100%", padding: "10px", borderTop: "1px solid #ccc", marginTop: "20px" }}>
      <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.role === "user" ? "You: " : "ChatBot: "}</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI..."
          style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: "5px", padding: "8px 12px", borderRadius: "5px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
