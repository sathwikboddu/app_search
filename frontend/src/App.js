import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SearchPage from "./components/SearchPage";
import SupervisorPanel from "./components/SupervisorPanel";
import AppDetailPage from "./components/AppDetailPage";
import Navbar from "./components/Navbar"; // Import Navbar

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      {user && <Navbar user={user} setUser={setUser} />} {/* Show Navbar if logged in */}
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/search" element={user ? <SearchPage user={user} setUser={setUser} /> : <Login setUser={setUser} />} />
        <Route path="/supervisor" element={user ? <SupervisorPanel user={user} setUser={setUser} /> : <Login setUser={setUser} />} />
        <Route path="/app/:appId" element={user ? <AppDetailPage user={user} setUser={setUser} /> : <Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
