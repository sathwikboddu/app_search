import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./SearchPage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [user, setUser] = useState(null); // ✅ Store logged-in user info
  const navigate = useNavigate();

  // ✅ Fetch user details on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.username);
        if (res.data.is_superuser) {
          setIsSuperUser(true);
        }
      })
      .catch((err) => console.error("User info fetch error:", err));
  }, []);

  useEffect(() => {
    if (query.length >= 3) {
      axios
        .get(`${API_BASE_URL}/search/?q=${query}`)
        .then((res) => {
          console.log("API Response:", res.data);
          if (Array.isArray(res.data)) {
            setSuggestions(res.data);
          } else {
            setSuggestions([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching suggestions:", err);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelectApp = (app) => {
    navigate(`/app/${app.id}`);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && query.length >= 3) {
      axios
        .get(`${API_BASE_URL}/search/?q=${query}`)
        .then((res) => {
          console.log("Search Results:", res.data);
          if (Array.isArray(res.data)) {
            setSearchResults(res.data);
          } else {
            setSearchResults([]);
          }
        })
        .catch(() => setSearchResults([]));
      setSuggestions([]);
    }
  };

  return (
    <div className="search-container">
      {/* ✅ Header with logged-in user and supervisor button */}
      <div className="header">
        <span className="user-info">Logged in as: {user}</span>
        {isSuperUser && (
          <button onClick={() => navigate("/supervisor")} className="supervisor-btn">
            Supervisor Panel
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Search for an app..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearchSubmit}
        className="search-input"
      />

      {suggestions.length > 0 && (
        <ul className="dropdown">
          {suggestions.map((app) => (
            <li key={app.id} onClick={() => handleSelectApp(app)} className="dropdown-item">
              {app.app_name}
            </li>
          ))}
        </ul>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results:</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>App Name</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((app, index) => (
                <tr key={app.id} onClick={() => handleSelectApp(app)} className="clickable">
                  <td>{index + 1}</td>
                  <td>{app.id}</td>
                  <td>{app.app_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
