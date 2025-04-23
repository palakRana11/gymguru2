import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waterIntake, setWaterIntake] = useState(Array(8).fill(false));

  const quotes = [
    "You're one workout away from a better mood. 💪",
    "Sweat is just fat crying. 🔥",
    "Believe you can and you're halfway there. ✨",
    "The body achieves what the mind believes. 🧠",
    "No pain, no gain. 💯",
    "Push yourself because no one else is going to do it for you. 🚀",
    "Strive for progress, not perfection. 🌱",
    "Every step counts, no matter how small. 👣",
    "Your only limit is you. 🌟",
    "The best project you'll ever work on is you. 💖",
  ];

  const [quote] = useState(
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:8000/username", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch username");
        }

        setUserName(data.name || "User");
      } catch (err) {
        console.error("Username fetch error:", err);
        setError(err.message);

        if (err.message.includes("Invalid token") || err.message.includes("expired")) {
          localStorage.removeItem("token");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  const handleGlassClick = (index) => {
    setWaterIntake((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-white">
        Loading user information...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">Error: {error}</div>
    );
  }

  const greeting = `Hello, ${userName}! Welcome to your fitness journey!`;

  const cards = [
    {
      title: "Workout Plan",
      description: "Get your weekly personalized workout and diet in one click.",
      path: "/plan",
      color: "bg-green-500",
    },
    {
      title: "Calculate Calories",
      description: "Calculate your daily calorie intake and burn.",
      path: "/calorie",
      color: "bg-yellow-500",
    },
    {
      title: "Calculate BMI",
      description: "Calculate your BMI.",
      path: "/bmi",
      color: "bg-red-500",
    },
    {
      title: "Track Progress",
      description: "Monitor your weight, diet, and fitness goals.",
      path: "/track",
      color: "bg-blue-500",
    },
    {
      title: "ChatBot",
      description: "Ask anything—nutrition, fitness, or motivation!",
      path: "/guru",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-evenly p-6">
      {/* 👋 Greeting */}
      <h1 className="text-2xl md:text-3xl text-green-400 text-center max-w-xxxxl font-bold">
        {greeting}
      </h1>

      {/* 💡 Motivational Quote */}
      <h2 className="text-2xl md:text-3xl text-green-400 text-center max-w-xl font-semibold">
        {quote}
      </h2>

      {/* 🔗 Link Cards */}
      <div className="flex gap-6 flex-wrap justify-center">
        {cards.map((card, index) => (
          <Link
            to={card.path}
            key={index}
            className={`${card.color} text-black p-6 rounded-xl w-64 hover:scale-105 transition-transform shadow-md`}
          >
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-sm">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* 💧 Water Intake Tracker */}
      <div className="text-center mt-6">
        <h3 className="text-lg text-blue-300 font-semibold mb-2">
          💧 Complete Your Water Intake Goal
        </h3>
        <div className="flex justify-center gap-2 flex-wrap">
          {waterIntake.map((filled, idx) => (
            <div
              key={idx}
              onClick={() => handleGlassClick(idx)}
              className={`w-6 h-12 cursor-pointer transition border-2 rounded-[2px] ${
                filled
                  ? "bg-blue-400 border-blue-300"
                  : "bg-white/10 border-blue-400"
              }`}
              style={{
                clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                transform: "rotate(180deg)",
                WebkitBackdropFilter: "blur(8px)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
              }}
              title={`Glass ${idx + 1}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
