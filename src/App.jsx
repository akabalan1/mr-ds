
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Player from "./pages/Player";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/player" element={<Player />} />
        <Route path="*" element={<div style={{ padding: 20 }}><h2>Welcome! Use /admin or /player to begin.</h2></div>} />
      </Routes>
    </Router>
  );
}
