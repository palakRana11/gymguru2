import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/GymGuruLogo.png"; // Import the logo

export default function Navbar() {
  return (
    <nav className="bg-black text-white h-28 p-4 flex items-center justify-between">
      {/* Logo Section */}
      <Link to="/dashboard">
        <img src={logo} alt="GymGuru Logo" className="h-24 px-10 w-auto ml-4" />
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link to="/guru" className="hover:text-green-400">Ask GymGuru</Link>
        <Link to="/track" className="hover:text-green-400">Track Diet</Link>
        <Link to="/plan" className="hover:text-green-400">Plan workout and diet</Link>
        <Link to="/calorie" className="hover:text-green-400">Count the calories</Link>
        <Link to="/bmi" className="hover:text-green-400">Calculate BMI</Link>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Redirect after logout
          }}
          className="hover:text-red-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

