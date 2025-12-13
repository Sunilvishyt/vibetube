import React from "react";
import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import Homepage from "./pages/Homepage";
import UploadPage from "./pages/UploadPage";
import WatchPage from "./pages/WatchPage";
import Logout from "./pages/Logout";
import SearchPage from "./pages/SearchPage";
import Testpage from "./pages/Testpage";
import Likedpage from "./pages/Likedpage";
import Historypage from "./pages/Historypage";
import Trendingpage from "./pages/Trendingpage";
import Profilepage from "./pages/Profilepage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/liked" element={<Likedpage />} />
        <Route path="/history" element={<Historypage />} />
        <Route path="/trending" element={<Trendingpage />} />
        <Route path="/profile/:id" element={<Profilepage />} />
        <Route path="/testpage" element={<Testpage />} />
      </Routes>
    </>
  );
}

export default App;
