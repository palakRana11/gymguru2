import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import NotFound from './components/NotFound';
import Navbar from "./components/Navbar";
import Dashboard from './components/Dashboard';  
import { UserContext } from './contexts/UserContext';
import Track from './components/Track';
import Chatbot from './components/ChatBot';
import WorkoutPlan from './components/WorkoutPlan';
import WorkoutGuide from './components/WorkoutGuide';
import CaloriesBurnt from './components/CaloriesBurnt';
import BMI from './components/BMI';
function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is logged in
  const [loggedUser, setLoggedUser] = useState(null); // State to hold logged user info

  useEffect(() => {
    console.log("User logged in:", loggedUser);
  }, [loggedUser]); // Log whenever `loggedUser` changes
  
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      setLoggedUser(token); // ✅ Store the token as a string (No JSON.parse needed)
    } else {
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.pathname = "/login";
      }
    }
  }, []);

  // Only show Navbar if we're not on login or register pages
  const showNavbar = !(window.location.pathname === "/login" || window.location.pathname === "/register");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showNavbar && <Navbar />}

      <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/track" element={isAuthenticated ? <Track /> : <Navigate to ="/login" />} />
          <Route path="/guru" element={isAuthenticated ? <Chatbot /> : <Navigate to ="/login" />} />
          <Route path="/plan" element={isAuthenticated ? <WorkoutPlan /> : <Navigate to ="/login" />} />
          <Route path="/guide" element={isAuthenticated ? <WorkoutGuide /> : <Navigate to ="/login" />} />
          <Route path="/calorie" element={isAuthenticated ? <CaloriesBurnt /> : <Navigate to ="/login" />} />
          <Route path="/bmi" element={isAuthenticated ? <BMI /> : <Navigate to ="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
