import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { useSearchParams, Link } from "react-router-dom";

// Add your actual Gemini API key here
const ai = new GoogleGenAI({ apiKey: "AIzaSyACGuNc16pk0PYjgPcGFz22vJOjt7nEzTo" });

export default function WorkoutPlan() {
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleGenerate = async () => {
    if (!goal || !minutes) return;
    if (!ai.apiKey) {
      setPlan("API key is missing. Please check your setup.");
      return;
    }

    setLoading(true);

    try {
      const prompt = `Create a 2 week workout plan for a person to achieve the goal "${goal}" in ${minutes} minutes per day. Make a week's plan different and structure it as a table. `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const text =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not generate plan. Please try again.";

      console.log("Generated Response:", text); // for debugging
      setPlan(text);
    } catch (err) {
      console.error("Error generating plan:", err);
      setPlan("Failed to generate plan. Please try again later.");
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGenerate();
  };

  const renderWorkoutTable = (raw) => {
    if (!raw.includes("|")) {
      return <p className="text-lg whitespace-pre-wrap">{raw}</p>; // fallback if no table formatting
    }

    const weeks = raw.split("**Week");
    return weeks.slice(1).map((weekText, i) => {
      const lines = weekText.split("\n").filter((line) => line.trim());
      const weekTitle = `Week ${i + 1}`;
      return (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-green-300">{weekTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-600 text-sm md:text-base">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 border border-gray-600">Day</th>
                  <th className="p-2 border border-gray-600">Workout</th>
                  <th className="p-2 border border-gray-600">Details</th>
                </tr>
              </thead>
              <tbody>
                {lines.slice(1).map((line, idx) => {
                  const parts = line.split("|").map((p) => p.trim()).filter(Boolean);
                  if (parts.length < 3) return null;

                  const [day, workout, details] = parts;
                  const workoutName = workout.replace(/\*\*/g, "");

                  return (
                    <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="p-2 border border-gray-600">{day}</td>
                      <td className="p-2 border border-gray-600">
                        <Link
                          to={`/guide?type=${encodeURIComponent(workoutName)}&minutes=${minutes}`}
                          className="text-green-400 underline hover:text-green-300"
                        >
                          {workoutName}
                        </Link>
                      </td>
                      <td className="p-2 border border-gray-600">{details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Workout Planner</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gray-800 p-6 rounded-xl shadow-lg mb-6"
      >
        <input
          type="text"
          placeholder="Fitness Goal (e.g. build muscle)"
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
        <button
          type="submit"
          className="w-full bg-green-400 text-black p-3 rounded hover:bg-green-500"
        >
          Generate Plan
        </button>
      </form>

      <div className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-xl">
        {loading ? (
          <p className="text-lg">Generating your personalized workout...</p>
        ) : (
          plan && renderWorkoutTable(plan)
        )}
      </div>
    </div>
  );
}

//AIzaSyCRCFwmGDi7CXrz0gZN7yibaNno18Rxrkw

