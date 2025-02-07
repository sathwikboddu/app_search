import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axios.post(`${API_BASE_URL}/logout/`, { refresh_token: refreshToken }, { withCredentials: true });
      }
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken"); // Clear refresh token
      setUser(null);
      navigate("/"); // Redirect to login
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="navbar">
      <h2 onClick={() => navigate("/search")} className="logo">App Review</h2>
      <div className="navbar-right">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
