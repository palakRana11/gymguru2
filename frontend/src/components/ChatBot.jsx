import { useState } from "react";
import axios from "axios";
import BackImg from "../assets/GuruBg.png";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("http://localhost:8000/gemini", {
        prompt: `You are a gym and nutrition advising assistant. Please respond concisely and in bullet points.\n${input}`,
      });

      let reply = response.data.reply || "Sorry, I couldn't understand.";
      reply = formatText(reply);

      const botMessage = { text: reply, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error calling backend:", error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error contacting AI.", sender: "bot" },
      ]);
    }

    setInput("");
  }

  function formatText(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.*?)\*/g, "<br />$1<br />");
    text = text.replace(/\n/g, "<br />");
    return text;
  }

  return (
    <div
      className="h-screen bg-gray-900 text-white flex flex-col items-center p-6"
      style={{ backgroundImage: `url(${BackImg})` }}
    >
      <h1 className="text-3xl font-bold text-green-400 mb-2">
        Keep your queries away – Ask the GURU💬!
      </h1>

      <div className="w-full max-w-3xl h-[600px] bg-gray-800 p-6 rounded-xl shadow-2xl overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 my-3 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-green-600 text-white ml-auto text-right"
                : "bg-gray-700 text-gray-200 mr-auto text-left"
            }`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          ></div>
        ))}
      </div>

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
