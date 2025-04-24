import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { useSearchParams, Link } from "react-router-dom";
import BackImg from "../assets/PlannerBg.png"; // Background image

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: "AIzaSyACGuNc16pk0PYjgPcGFz22vJOjt7nEzTo", // ⚠️ Move this to backend for security
});

export default function WorkoutPlan() {
  const [goal, setGoal] = useState("");
  const [minutes, setMinutes] = useState("");
  const [cuisine, setCuisine] = useState("Indian");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("nutrifit_plan");
    if (saved) setPlan(saved);
  }, []);

  const handleGenerate = async () => {
    if (!goal || !minutes || !cuisine) return;

    setLoading(true);
    try {
      const prompt = `Create two separate, clearly labeled markdown tables: one for a 1-week workout plan and one for a 1-week diet plan. 
Each table must have a header row and at least 7 rows (one per day). 
The workout table should include the day and workout name (like "Cardio + Stretching", "Upper Body Strength", etc).
The diet table should include the day and meals, using the "${cuisine}" cuisine.
No extra explanations—only the **Workout Plan** and **Diet Plan** titles above the tables in bold.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not generate plan.";

      setPlan(text);
      localStorage.setItem("nutrifit_plan", text); // Save plan
    } catch (err) {
      console.error(err);
      setPlan("Failed to generate plan. Try again.");
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGenerate();
  };

  const renderPlanTables = (raw) => {
    if (!raw.includes("|"))
      return <p className="text-lg whitespace-pre-wrap">{raw}</p>;

    const sections = raw.split(/(?=\*\*.*?Plan)/);

    return sections.map((section, index) => {
      const isWorkout = section.toLowerCase().includes("workout");
      const isDiet = section.toLowerCase().includes("diet");
      if (!isWorkout && !isDiet) return null;

      const lines = section
        .split("\n")
        .filter((line) => line.trim() && line.includes("|"));
      if (lines.length === 0) return null;

      const title =
        section.match(/\*\*(.*?)\*\*/)?.[1] ||
        (isWorkout ? "Workout Plan" : "Diet Plan");

      return (
        <div key={index} className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-green-300">{title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-700 text-sm md:text-base">
              <thead>
                <tr className="bg-gray-700">
                  {lines[0]
                    .split("|")
                    .filter(Boolean)
                    .map((head, idx) => (
                      <th key={idx} className="p-2 border border-gray-600">
                        {head.trim()}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {lines.slice(1).map((line, idx) => {
                  const parts = line
                    .split("|")
                    .filter(Boolean)
                    .map((p) => p.trim());
                  return (
                    <tr
                      key={idx}
                      className="border-b border-gray-700 hover:bg-gray-800"
                    >
                      {parts.map((cell, i) => {
                        const text = cell.replace(/\*\*/g, "");
                        const isWorkoutCell = isWorkout && i === 1;
                        return (
                          <td key={i} className="p-2 border border-gray-600">
                            {isWorkoutCell ? (
                              <Link
                                to={`/guide?type=${encodeURIComponent(
                                  text
                                )}&minutes=${minutes}`}
                                className="text-green-400 underline hover:text-green-300"
                              >
                                {text}
                              </Link>
                            ) : (
                              text
                            )}
                          </td>
                        );
                      })}
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
    <div
      className="min-h-screen text-white flex flex-col items-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${BackImg})` }}
    >
      <h1 className="text-3xl font-bold mb-6 text-green-400 bg-black border border-black px-4 py-2 rounded-lg">
        Weekly Workout & Diet Planner
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gray-800 p-6 rounded-xl shadow-lg mb-8"
      >
        <input
          type="text"
          placeholder="Fitness Goal (e.g. lose fat, build muscle)"
          className="w-full mb-4 p-3 rounded text-black"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Workout Time (in minutes per day)"
          className="w-full mb-4 p-3 rounded text-black"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          required
        />
        <select
          className="w-full mb-4 p-3 rounded text-black"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          required
        >
          <option value="Indian">Indian</option>
          <option value="Pure Vegeterian Indian">Pure Veg Indian</option>
          <option value="Eggiterian Indian">Eggiterrian Indian</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Continental">Continental</option>
          <option value="Vegan">Vegan</option>
          <option value="High Protein">High Protein</option>
          <option value="Saatvik">Saatvik</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-400 text-black p-3 rounded hover:bg-green-500"
        >
          Generate Plan
        </button>
      </form>

      <div className="w-full max-w-5xl bg-gray-800 p-6 rounded-xl shadow-xl">
        {loading ? (
          <p className="text-lg text-center">Generating your weekly plan...</p>
        ) : (
          plan && renderPlanTables(plan)
        )}
      </div>
    </div>
  );
}
