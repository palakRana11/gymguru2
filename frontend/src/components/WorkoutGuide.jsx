import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import BackImg from "../assets/GuideBg.png";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAlB0lbUjSTVWTkR1qJF56Evka9XjCsqTw" });

export default function WorkoutGuide() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const minutes = searchParams.get("minutes");
  const [guide, setGuide] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const prompt = `Create a precise workout guide for the following workout: "${type}" lasting ${minutes} minutes. Show the calories burnt expected after this workout. Include warm-up, main exercises, rest periods, and cool-down. Keep it motivational and easy to follow. Don't make it too wordy. Use bullet points and no stars. Give Headings in Bold and in a bigger font size.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const parts = response?.candidates?.[0]?.content?.parts;
        let rawText = parts?.map((p) => p.text).join("\n\n") || "No guide found.";

        // Format: Bold to <h2>
        rawText = rawText.replace(/\*\*(.*?)\*\*/g, "<h2 class='text-xl font-bold mt-6 mb-2'>$1</h2>");

        // Bullet points: - or • to <li>
        rawText = rawText.replace(/(?:^|\n)[\-•]\s?(.*?)(?=\n|$)/g, "<li class='mb-1'>• $1</li>");

        // Wrap list items inside <ul>
        rawText = rawText.replace(/(<li[\s\S]*?<\/li>)/g, "<ul class='list-disc list-inside pl-4 my-2'>$1</ul>");

        // Convert double newlines to paragraphs and single to <br />
        rawText = rawText
          .split(/\n{2,}/)
          .map((block) => {
            // Already converted blocks
            if (block.startsWith("<h2") || block.startsWith("<ul")) return block;
            return `<p class='mb-4 leading-relaxed'>${block.trim().replace(/\n/g, "<br />")}</p>`;
          })
          .join("");

        setGuide(rawText);
      } catch (err) {
        console.error("Error fetching workout guide:", err);
        setGuide("<p>Something went wrong while generating your guide. Try again later.</p>");
      }
      setLoading(false);
    };

    if (type && minutes) fetchGuide();
  }, [type, minutes]);

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-6 pt-20"
      style={{ backgroundImage: `url(${BackImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <h1 className="text-3xl font-bold text-green-400 mb-4 bg-black border border-black px-4 py-2 rounded-lg">
        {type}
      </h1>

      {loading ? (
        <p className="text-lg font-semibold">Loading guide...</p>
      ) : (
        <div
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-sm md:text-base max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: guide }}
        />
      )}
    </div>
  );
}


//AIzaSyAlB0lbUjSTVWTkR1qJF56Evka9XjCsqTw