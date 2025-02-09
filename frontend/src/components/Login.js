import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, setAuthToken } from "../config";
import "./Login.css"; // Import the CSS file


const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState(""); // ✅ State to store messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    const endpoint = isLogin ? "/login/" : "/register/";

    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { username, password });

      if (isLogin) {
        // ✅ Successful login
        setAuthToken(response.data.access);
        localStorage.setItem("authToken", response.data.access);
        setUser(response.data.user.username);
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/search"), 1000); // Redirect after showing success
      } else {
        // ✅ Successful signup
        setMessage(response.data.message || "Registration successful! Please log in.");
        setTimeout(() => setIsLogin(true), 1500); // Switch to login form
      }
    } catch (error) {
      // ❌ Handle errors
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>

        {/* ✅ Display message (success or error) */}
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        <button className="toggle-btn" onClick={() => { setIsLogin(!isLogin); setMessage(""); }}>
          {isLogin ? "Create an account" : "Back to Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
