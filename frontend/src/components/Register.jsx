import React, { useState } from "react";
import BgImage from "../assets/image.png"; // I may change this in future to a more suitable image

export default function Register() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    age: ""
  });

  function handleChange(event) {
    setUserDetails((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(userDetails);

    fetch("http://localhost:8000/register", {
      // Matches our backend route in the userModel
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.error) {
          alert(`Error: ${data.error}`);
        } else {
          alert("User registered successfully!");
          console.log("Please Login Now");
          window.location.href = "/login"; // Redirect to the login page
        }
      })
      .catch(error => console.error("Error:", error));
  }

  return (
    <section className="h-screen w-full grid grid-cols-1 md:grid-cols-2">
      {/* Full Left Image Section */}
      <div className="hidden md:block h-full w-full">
        <img
          src={BgImage}
          alt="Fitness Illustration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="bg-gray-800 text-white flex items-center justify-center h-full w-full">
        <form
          className="relative w-full max-w-md p-8 bg-gray-900 text-white rounded-lg shadow-lg flex flex-col gap-5 items-center transition duration-300 border-2 border-transparent"
          style={{
            backgroundImage:
              "linear-gradient(black, black), radial-gradient(circle, #39ff14, #00ffcc)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold">Start Your Fitness Journey Here</h1>
          <h2 className="text-xl font-semibold">Register</h2>

          <input
            className="w-full h-12 rounded-lg px-5 outline-none border-2 border-green-400 bg-gray-700 text-white focus:ring-2 focus:ring-green-400 transition"
            placeholder="Enter Name"
            name="name"
            type="text"
            required
            value={userDetails.name}
            onChange={handleChange}
          />

          <input
            className="w-full h-12 rounded-lg px-5 outline-none border-2 border-green-400 bg-gray-700 text-white focus:ring-2 focus:ring-green-400 transition"
            placeholder="Enter E-Mail"
            name="email"
            type="email"
            required
            value={userDetails.email}
            onChange={handleChange}
          />

          <input
            className="w-full h-12 rounded-lg px-5 outline-none border-2 border-green-400 bg-gray-700 text-white focus:ring-2 focus:ring-green-400 transition"
            placeholder="Enter Password"
            name="password"
            type="password"
            required
            maxLength={10}
            value={userDetails.password}
            onChange={handleChange}
          />

          <input
            className="w-full h-12 rounded-lg px-5 outline-none border-2 border-green-400 bg-gray-700 text-white focus:ring-2 focus:ring-green-400 transition"
            placeholder="Enter Age"
            name="age"
            type="number"
            required
            max={100}
            min={12}
            value={userDetails.age}
            onChange={handleChange}
          />

          {/* Neon Gradient Button with Hover Effect */}
          <button
            className="relative px-6 py-3 rounded-lg font-bold w-full text-center text-white transition duration-300 hover:shadow-neon"
            style={{
              border: "2px solid transparent",
              backgroundImage:
                "linear-gradient(black, black), radial-gradient(circle, #39ff14, #00ffcc)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            Join Now
          </button>

          <p className="text-sm mt-2">
            Already have an account?{" "}
            <a href="/login" className="text-green-400 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
