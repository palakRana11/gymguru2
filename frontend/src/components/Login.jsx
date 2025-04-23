import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import background from "../assets/LoginFinal.png"; // I may change this in furture to a more suitable image


export default function Login() {
  const loggedInData = useContext(UserContext);
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleInput(event) {
    setLoginDetails({ ...loginDetails, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginDetails),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data.token) {
          localStorage.setItem("token", data.token);
          loggedInData.setLoggedUser(data);
          navigate("/dashboard");
        }
      })
      .catch((err) => console.error("Error:", err));
  }

  return (
    <section
  className="h-screen w-full bg-cover bg-center flex items-center justify-start px-8"
  style={{
    backgroundImage: "url(" + background + ")", 
  }}
>
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md p-8 bg-black/70 backdrop-blur-md text-white rounded-lg shadow-xl flex flex-col gap-5 border border-green-400 ml-20"
  >
    <h1 className="text-2xl font-bold">Welcome Back</h1>
    <h2 className="text-xl font-medium">Sign In to your account</h2>

    {error && <p className="text-red-400 text-sm">{error}</p>}

    <input
      className="w-full h-12 px-5 rounded-lg bg-gray-700 text-white border border-green-400 focus:ring-2 focus:ring-green-400"
      placeholder="Enter E-Mail"
      name="email"
      type="email"
      required
      value={loginDetails.email}
      onChange={handleInput}
    />
    <input
      className="w-full h-12 px-5 rounded-lg bg-gray-700 text-white border border-green-400 focus:ring-2 focus:ring-green-400"
      placeholder="Enter Password"
      name="password"
      type="password"
      required
      value={loginDetails.password}
      onChange={handleInput}
    />

    <button
      type="submit"
      className="w-full py-3 px-6 rounded-lg font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-black hover:from-green-300 hover:to-cyan-300 transition duration-300 shadow-md"
    >
      Log In
    </button>

    <p className="text-sm mt-2">
      Don't have an account?{" "}
      <a href="/register" className="text-green-400 hover:underline">
        Register
      </a>
    </p>
  </form>
</section>

  );
}
