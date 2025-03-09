import React, { useState } from "react";
import axios from "axios";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const API_KEY = "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"; // 🔴 Replace this with your OpenRouter API key

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];
  
    setMessages(updatedMessages);
    setInput("");
  
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",  // OpenRouter API URL
        {
          model: "gpt-3.5-turbo",  // Use the valid model
          messages: updatedMessages,
        },
        {
          headers: {
            Authorization: "Bearer ${API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "chrome-extension://bnjjjopfnppjobmgcpmeihjckicokefn",  // Your extension's URL
          },
        }
      );
  
      setMessages([...updatedMessages, response.data.choices[0].message]);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("Failed to fetch response.");
    }
  };
  

  return (
    <div style={{ width: "100%", padding: "10px", borderTop: "1px solid #ccc", marginTop: "20px" }}>
      <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.role === "user" ? "You: " : "ChatGPT: "}</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask ChatGPT..."
          style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "5px",
            padding: "8px 12px",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
