import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Callback from './Callback'
import PnL from "./PNL";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/pnl" element={<PnL />} />
      </Routes>
    </Router>
  );
}

export default App;
