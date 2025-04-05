import React, { useState, useEffect } from "react";

const CaloriesBurnt = () => {
  const [formData, setFormData] = useState({
    gender: "",
    height: "",
    weight: "",
    duration: "",
  });

  const [age, setAge] = useState(null);
  const [calories, setCalories] = useState(null);

  useEffect(() => {
    const fetchAge = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/username", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.age) {
          setAge(data.age);
        } else {
          console.error("Age not received:", data);
        }
      } catch (err) {
        console.error("Error fetching age:", err);
      }
    };

    fetchAge();

    const savedData = localStorage.getItem("userFitnessData");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { gender, height, weight, duration } = formData;

    localStorage.setItem("userFitnessData", JSON.stringify(formData));

    const payload = {
      gender: gender === "Male" ? 1 : 0,
      age: Number(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      duration: parseFloat(duration),
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result && result.calories_burnt !== undefined) {
        setCalories(result.calories_burnt.toFixed(2));
      } else {
        console.error("Invalid prediction response:", result);
      }
    } catch (err) {
      console.error("Prediction error:", err);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-4 py-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          🔥 Calories Burnt Calculator
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-2/3 grid grid-cols-2 gap-4 text-sm"
          >
            <div className="col-span-2">
              <label className="block mb-1 font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 rounded text-white"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

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
              <label className="block mb-1 font-medium">Workout Duration (min)</label>
              <input
                name="duration"
                type="number"
                placeholder="e.g. 30"
                value={formData.duration}
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
                Predict
              </button>
            </div>
          </form>

          <div className="w-full md:w-1/3 flex items-center justify-center">
            {calories ? (
              <div className="text-center text-green-300 text-lg">
                <p>
                  ✅ You burnt <strong>{calories}🔥</strong> kcal!
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-400 text-sm">
                Enter details to calculate calories burnt.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaloriesBurnt;



