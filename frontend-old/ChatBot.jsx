import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

// ✅ Initialize Gemini AI with your API Key
const ai = new GoogleGenAI({ apiKey: "AIzaSyACGuNc16pk0PYjgPcGFz22vJOjt7nEzTo" });

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🧠 Send message to Gemini with a request to be concise
  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a gym and nutrition advising assistant. Please respond concisely and in bullet points in a list and not in stars.\n${input}`,
              },
            ],
          },
        ],
      });

      let reply =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand.";

      

      const botMessage = {
        text: reply,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error contacting AI.", sender: "bot" },
      ]);
    }

    setInput("");
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {/* 🟢 Top Heading */}
      <h1 className="text-3xl font-bold text-green-400 mb-2">
        Keep your queries away – it's chatbot time!
      </h1>

      {/* 💬 Chat Box */}
      <div className="w-full max-w-3xl h-[600px] bg-gray-800 p-6 rounded-xl shadow-2xl overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 my-3 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-green-600 text-white ml-auto text-right"
                : "bg-gray-700 text-gray-200 mr-auto text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* ✏️ Input Box */}
      <div className="w-full max-w-3xl flex mt-6">
        <input
          type="text"
          className="flex-1 p-4 rounded-l-lg text-black bg-gray-200 border-none focus:ring-green-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-green-400 text-black font-semibold p-4 rounded-r-lg hover:bg-green-500 transition-all shadow-md"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
