import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./GameContext";
import AdminHome from "./pages/AdminHome";
import AdminKahoot from "./pages/AdminKahoot";
import AdminMajority from "./pages/AdminMajority";
import PlayerJoin from "./pages/PlayerJoin";
import Waiting from "./pages/Waiting";
import PlayerKahoot from "./pages/PlayerKahoot";
import PlayerMajority from "./pages/PlayerMajority";
import Results from "./pages/Results";

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/join" element={<PlayerJoin />} />
          <Route path="/waiting" element={<Waiting />} />
          <Route path="/play/kahoot" element={<PlayerKahoot />} />
          <Route path="/play/majority" element={<PlayerMajority />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/kahoot" element={<AdminKahoot />} />
          <Route path="/admin/majority" element={<AdminMajority />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
