import React, { useState, useEffect } from "react";
import BackImg from "../assets/BMIBg.png"; // Import the background image

const BMI = () => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
  });

  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("userPhysiqueData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getCategory = (bmiValue) => {
    if (bmiValue < 18.5) return "Underweight 🟡";
    else if (bmiValue < 25) return "Normal weight 🟢";
    else if (bmiValue < 30) return "Overweight 🟠";
    else return "Obese 🔴";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { height, weight } = formData;

    localStorage.setItem("userPhysiqueData", JSON.stringify(formData));

    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      const fixedBmi = bmiValue.toFixed(2);
      setBmi(fixedBmi);
      setCategory(getCategory(bmiValue));
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-4 py-6"
    style={{ backgroundImage: `url(${BackImg})` }}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">🧮 BMI Calculator</h2>

        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-2/3 grid grid-cols-2 gap-4 text-sm"
          >
            <div>
              <label className="block mb-1 font-medium">Height (cm)</label>
              <input
                name="height"
                type="number"
                placeholder="e.g. 165"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Weight (kg)</label>
              <input
                name="weight"
                type="number"
                placeholder="e.g. 60"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 transition py-2 rounded text-white font-semibold"
              >
                Calculate!
              </button>
            </div>
          </form>

          <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center">
            {bmi ? (
              <div className="text-green-300 text-lg space-y-2">
                <p>✅ Your BMI is <strong>{bmi}</strong></p>
                <p className="text-base">📊 Category: <strong>{category}</strong></p>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                Enter your height and weight to calculate BMI.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMI;
