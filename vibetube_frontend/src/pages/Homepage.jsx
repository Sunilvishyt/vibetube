import React from "react";
import Navbar from "@/components/my_components/navbar";
import VideoCard from "@/components/my_components/VideoCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import axios from "axios";

function Homepage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const verify_token = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login", { replace: true });
      return false;
    }

    try {
      const res = await axios.get("http://localhost:8000/verify-token", {
        // This 'headers' object is where you place the Authorization token
        headers: {
          // This is the essential part for the token to be sent to FastAPI
          Authorization: `Bearer ${token}`,
          // Note: 'Content-Type': 'application/json' is usually unnecessary for GET requests
        },
      });
      const user = res.data.details.username;
      const user_email = res.data.details.email;
      setUsername(user);
      setEmail(user_email);
      return true;
    } catch (error) {
      // 3. Handle Errors (401 Unauthorized, 403 Forbidden, etc.)
      const statusCode = error.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        // Token is invalid, expired, or user not found -> FORCE LOGOUT/REDIRECT
        localStorage.removeItem("access_token"); // Clean up stored token
        navigate("/login", { replace: true });
        return false; // Stop execution here
      }
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      const isAuthenticated = await verify_token();

      if (isAuthenticated) {
        const fetchVideos = async () => {
          try {
            const response = await axios.get("http://localhost:8000/videos");
            setVideos(response.data);
          } catch (error) {
            console.error("Error fetching videos:", error);
            setVideos([]);
          }
        };
        fetchVideos();
      }
    };
    initializePage();
  }, [navigate]);

  function formatTimeAgo(timestamp) {
    // 1. Parse the ISO string into a JavaScript Date object
    const date = parseISO(timestamp);

    // 2. Calculate the distance from this date to the current time (Now)
    // The 'addSuffix: true' option adds "ago" or "from now".
    const result = formatDistanceToNow(date, { addSuffix: true });
    return result;
  }

  return (
    <>
      <Navbar userName={username} userEmail={email} />
      <hr />
      <div className="bg-chart-3 h-fit w-full p-8">
        <h1 className="font-bold size-20 w-full">Recommended for you</h1>
        <div className="flex justify-center">
          <div className="flex w-[90vw] max-w-[1300px] gap-6 flex-wrap ">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                thumbnail={video.thumbnail_url}
                duration="5:00"
                title={video.title}
                channelName={video.username}
                channelAvatar="https://picsum.photos/100"
                views={video.views}
                uploadedAt={formatTimeAgo(video.created_at)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage;
