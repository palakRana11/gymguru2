import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import image from "../assets/DashBanner.png";
import guruImg from "../assets/guru.png";

const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [waterIntake, setWaterIntake] = useState(Array(8).fill(false));
  const [streak, setStreak] = useState(0);

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
        if (!token) throw new Error("No authentication token found");

        const response = await fetch("http://localhost:8000/username", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch username");

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

  useEffect(() => {
    if (!userName || userName === "User") return;

    const storedStreak = localStorage.getItem(`${userName}_streak`);
    const storedWaterIntake = JSON.parse(localStorage.getItem(`${userName}_waterIntake`));

    if (storedStreak) setStreak(parseInt(storedStreak));
    if (storedWaterIntake) setWaterIntake(storedWaterIntake);
  }, [userName]);

  const handleGlassClick = (index) => {
    const newWaterIntake = [...waterIntake];
    newWaterIntake[index] = !newWaterIntake[index];
    setWaterIntake(newWaterIntake);
    localStorage.setItem(`${userName}_waterIntake`, JSON.stringify(newWaterIntake));
  };

  const handleWorkoutDone = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem(`${userName}_streak`, newStreak);
  };

  const totalWaterLiters = (waterIntake.filter(Boolean).length * 0.5).toFixed(1);

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading user information...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  const cards = [
    {
      title: "Workout and Diet Plan",
      description: "Get your weekly personalized workout and diet in one click.",
      path: "/plan",
      color: "bg-green-500",
    },
    {
      title: "Count those Calorie Burns",
      description: "Calculate your daily calorie burnt based on your workout.",
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
      description: "Monitor your diet, and fitness goals.",
      path: "/track",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 relative">
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-in-out forwards;
          }
          .glass {
            transition: background-color 0.4s ease, transform 0.3s ease;
          }
          .glass-filled {
            background-color: #60a5fa;
            transform: scale(1.1);
          }
          .glass-empty {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `}
      </style>

      {/* Banner */}
      <img
        src={image}
        alt="Fitness Banner"
        className="w-full h-81 object-cover rounded-xl mb-4"
      />

      {/* Greeting and Trackers */}
      <div className="flex justify-between items-center mb-4 px-2 flex-wrap gap-4">
        {/* Streak */}
        <div className="text-left">
          <h2 className="text-lg font-bold text-orange-400">🔥 Streak: {streak} days</h2>
          <button
            onClick={handleWorkoutDone}
            className="mt-1 bg-orange-500 text-white py-1 px-3 rounded hover:bg-orange-600 text-sm"
          >
            Workout Done
          </button>
        </div>

        {/* Greeting + Quote */}
        <div className="text-center grow animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-green-400">
            Hello, {userName}! Welcome to your fitness journey!
          </h1>
          <p className="text-green-300 text-sm md:text-base mt-1">{quote}</p>
        </div>

        {/* Water Intake */}
        <div className="text-right border border-blue-400 p-2 rounded-lg">
          <h3 className="text-blue-300 font-semibold mb-2 text-sm">Water Intake 💧</h3>
          <div className="flex gap-2 justify-end flex-wrap">
            {waterIntake.map((filled, idx) => (
              <div
                key={idx}
                onClick={() => handleGlassClick(idx)}
                className={`glass w-6 h-14 cursor-pointer border-2 rounded-[2px] ${
                  filled ? "glass-filled border-blue-300" : "glass-empty border-blue-400"
                }`}
                style={{
                  clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                  transform: "rotate(180deg)",
                  WebkitBackdropFilter: "blur(8px)",
                  backdropFilter: "blur(8px)",
                }}
                title={`Glass ${idx + 1}`}
              ></div>
            ))}
          </div>
          <p className="mt-1 text-xs text-blue-200">You drank {totalWaterLiters}L today</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="flex gap-6 flex-wrap justify-center my-8">
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

      {/* Talk to Guru Button */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center z-50">
        <Link to="/guru" className="relative group">
          <img
            src={guruImg}
            alt="Talk to Guru"
            className="w-16 h-16 rounded-full border-2 border-white shadow-lg cursor-pointer object-cover"
          />
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-ping group-hover:scale-110"></span>
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
        </Link>
        <p className="text-white text-xs mt-2">Talk to Guru</p>
      </div>
    </div>
  );
};

export default Dashboard;

