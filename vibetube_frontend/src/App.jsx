import React from "react";
import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
