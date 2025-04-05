import React, { useState,useContext } from "react";
import { UserContext } from "../contexts/UserContext"; // Import UserContext
import { useNavigate } from "react-router-dom";

export default function Login() {
    const loggedInData=useContext(UserContext); // Access UserContext
    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleInput(event) {
        setLoginDetails({
            ...loginDetails,
            [event.target.name]: event.target.value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError(""); // Clear previous errors

        fetch("http://localhost:8000/login", {//Should match our backend route
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginDetails),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setError(data.error);  // Show error message
            } else {
                if(data.token!==undefined){
                  

                  localStorage.setItem("token", data.token); // Save token received in the response from fetching api
                  console.log("Login successful!");
                  loggedInData.setLoggedUser(data);
                  navigate("/dashboard");  // Redirect to dashboard component
            }}
        })
        .catch(error => console.error("Error:", error));
    }
    

    return (
        <section className="h-screen w-full bg-gray-800 text-white flex items-center justify-center">
            <form
                className="relative w-full max-w-md p-8 bg-gray-900 text-white rounded-lg shadow-lg flex flex-col gap-5 items-center transition duration-300 border-2 border-transparent"
                style={{
                    backgroundImage: "linear-gradient(black, black), radial-gradient(circle, #39ff14, #00ffcc)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                }}
                onSubmit={handleSubmit}
            >
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <h2 className="text-xl font-semibold">Sign In to your account</h2>

                {error && <p className="text-red-500">{error}</p>} {/* Show error message */}

                <input
                    className="w-full h-12 rounded-lg px-5 outline-none border-2 border-green-400 bg-gray-700 text-white focus:ring-2 focus:ring-green-400 transition"
                    placeholder="Enter E-Mail"
                    name="email"
                    type="email"
                    required
                    value={loginDetails.email}
                    onChange={handleInput}
                />

                <input
                    className="w-full h-12 rounded-lg px-5 outline-none border-2 border-green-400 bg-gray-700 text-white focus:ring-2 focus:ring-green-400 transition"
                    placeholder="Enter Password"
                    name="password"
                    type="password"
                    required
                    value={loginDetails.password}
                    onChange={handleInput}
                />

                <button
                    className="relative px-6 py-3 rounded-lg font-bold w-full text-center text-white transition duration-300 hover:shadow-neon"
                    style={{
                        border: "2px solid transparent",
                        backgroundImage: "linear-gradient(black, black), radial-gradient(circle, #39ff14, #00ffcc)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                    }}
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
