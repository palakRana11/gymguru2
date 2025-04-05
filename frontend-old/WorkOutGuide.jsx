import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAlB0lbUjSTVWTkR1qJF56Evka9XjCsqTw" }); // Add your API key

export default function WorkoutGuide() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const minutes = searchParams.get("minutes");
  const [guide, setGuide] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const prompt = `Create a  precise workout guide for the following workout: "${type}" lasting ${minutes} minutes. Include warm-up, main exercises, rest periods, and cool-down. Keep it motivational and easy to follow. Dont make it too wordy . Use Bullet points and no stars.Give Headings in Bold and in a bigger font size.`;

        // Use the same API call pattern as your working component
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash", // Match model from working component
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }]
        });

        // Match response structure from working component
        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                    "No guide found.";
        
        setGuide(text);
      } catch (err) {
        console.error(err);
        setGuide("Generating....");
      }
      setLoading(false);
    };

    if (type && minutes) fetchGuide();
  }, [type, minutes]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-20">
      <h1 className="text-3xl font-bold text-green-400 mb-4">{type}</h1>
      {loading ? (
        <p>Loading guide...</p>
      ) : (
        <pre className="whitespace-pre-wrap text-sm md:text-base bg-gray-800 p-4 rounded-xl">
          {guide}
        </pre>
      )}
    </div>
  );
}