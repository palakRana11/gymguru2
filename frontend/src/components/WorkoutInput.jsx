import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WorkoutInput() {
  const [minutes, setMinutes] = useState("");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/plan?name=${encodeURIComponent(name)}&goal=${encodeURIComponent(goal)}&minutes=${minutes}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-neon-green">Your Personalized Workout Plan</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-6 rounded shadow-md">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full mb-4 p-3 rounded text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Fitness Goal (e.g., weight loss)"
          className="w-full mb-4 p-3 rounded text-black"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Workout Time in Minutes"
          className="w-full mb-4 p-3 rounded text-black"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-neon-green text-black p-3 rounded hover:bg-green-500">
          Get Plan
        </button>
      </form>
    </div>
  );
}
