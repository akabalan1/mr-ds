
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Player from "./pages/Player";
import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/player" element={<Player />} />
    </Routes>
  </BrowserRouter>
);
