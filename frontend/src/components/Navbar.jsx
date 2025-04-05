import React from "react";
import { Link } from "react-router-dom";
// import logo from "../assets/GymGuruLogo.png"; // Import the logo

export default function Navbar() {
  return (
    <nav className="bg-black text-white h-20 p-4 flex items-center justify-between">
      {/* Logo Section */}
      <Link to="/dashboard">
      hello
        {/* <img src={logo} alt="GymGuru Logo" className="h-24 px-0 w-auto ml-4" /> */}
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link to="/dashboard" className="hover:text-green-400">Dashboard</Link>
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

