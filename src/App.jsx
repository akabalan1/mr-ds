// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminHome from "./pages/AdminHome";
import AdminMajority from "./pages/AdminMajority";
import PlayerMajority from "./pages/PlayerMajority";
import AdminKahoot from "./pages/AdminKahoot";
import PlayerKahoot from "./pages/PlayerKahoot";
import PlayerJoin from "./pages/PlayerJoin"; // Add PlayerJoin
import { GameProvider } from "./GameContext";

export default function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/join" />} />
          <Route path="/join" element={<PlayerJoin />} /> {/* PlayerJoin route */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/majority" element={<AdminMajority />} />
          <Route path="/admin/kahoot" element={<AdminKahoot />} />
          <Route path="/play/majority" element={<PlayerMajority />} />
          <Route path="/play/kahoot" element={<PlayerKahoot />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
