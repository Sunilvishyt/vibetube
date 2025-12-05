import React from "react";
import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import Homepage from "./pages/Homepage";
import UploadPage from "./pages/UploadPage";
import WatchPage from "./pages/WatchPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
      </Routes>
    </>
  );
}

export default App;
