import React from "react";
import Navbar from "@/components/my_components/navbar";
import VideoCard from "@/components/my_components/VideoCard";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIDEOS_PER_PAGE = 12;
function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // 💡 NEW STATE: Keep track of the current offset (which page we are on)
  const [offset, setOffset] = useState(0);
  // 💡 NEW STATE: Track if there are more videos to load (if the last fetch returned less than limit)
  const [hasMore, setHasMore] = useState(true);
  // 💡 NEW STATE: Track the currently active category/query
  const [currentQuery, setCurrentQuery] = useState(
    location.state?.videoQuery || "random"
  );
  // 💡 NEW STATE: Loading state for the Load More button
  const [isLoading, setIsLoading] = useState(false);

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
        navigate("/login", {
          replace: true,
          state: {
            errorMessage: "Login Expired, Please login again",
            fromHomepage: true,
          },
        });
        return false; // Stop execution here
      }
    }
  };

  // ---------------------------------------------
  // 💡 CORE FETCH LOGIC
  // ---------------------------------------------
  const fetchVideos = async (query, fetchOffset, isLoadMore = false) => {
    setIsLoading(true); // Start loading

    try {
      // 💡 Construct the URL with query parameters for limit and offset
      const response = await axios.get(
        `http://localhost:8000/getvideos/${query}?limit=${VIDEOS_PER_PAGE}&offset=${fetchOffset}`
      );

      const newVideos = response.data;

      // 💡 Update video state: APPEND if loading more, REPLACE if a new category
      setVideos((prevVideos) =>
        isLoadMore ? [...prevVideos, ...newVideos] : newVideos
      );

      // 💡 Update offset for the next request
      setOffset(fetchOffset + newVideos.length);

      // 💡 Check if we received less than the requested limit, which means no more data
      setHasMore(newVideos.length === VIDEOS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching videos:", error);
      // Optionally: setHasMore(false) on error to prevent trying again
      setHasMore(false);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      const isAuthenticated = await verify_token();

      if (isAuthenticated) {
        const vidQuery = location.state?.videoQuery || "random";

        if (vidQuery !== currentQuery) {
          // Reset pagination state for a new category
          setVideos([]); // Clear old videos
          setOffset(0);
          setHasMore(true);
          setCurrentQuery(vidQuery); // Update tracking query

          // Fetch the first batch for the new category (offset 0)
          fetchVideos(vidQuery, 0, false);
        } else if (videos.length === 0) {
          // Initial load on first component mount for the current query
          fetchVideos(vidQuery, 0, false);
        }
      }
    };
    initializePage();
  }, [location.state?.videoQuery, location.pathname, navigate, currentQuery]);

  const handleLoadMore = () => {
    // Use the tracked offset and currentQuery to fetch the next batch
    fetchVideos(currentQuery, offset, true);
  };

  useEffect(() => {
    const message = location.state?.successMessage;

    if (message) {
      // Show the toast
      toast.custom((t) => (
        <div className="bg-gradient-to-r from-primary to-chart-1 text-white p-3 rounded-xl shadow-2xl w-full max-w-sm">
          <div className="flex items-center gap-3">
            <Heart className="h-3 w-5" />
            <div>
              <div className="font-semibold  text-lg">{message}</div>
              <div className="text-sm opacity-95">
                Enjoy videos personalized for you.
              </div>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="ml-auto bg-white/20 hover:bg-white/30 rounded-full h-8 w-8 text-xs font-semibold flex items-center justify-center shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      ));

      // CRITICAL: Clear the state immediately after showing the toast
      // The `replace: true` is essential here.
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.successMessage, location.pathname, navigate]);

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
      <Toaster position="bottom-right" richColors />

      <Navbar userName={username} userEmail={email} />
      <hr />
      <div className="bg-chart-3 h-fit w-full p-8">
        <h1 className="font-bold size-20 w-full">Recommended for you</h1>
        <div className="flex justify-center w-full">
          <div className="flex w-[90vw] min-w-[1000px] max-w-[1300px] gap-6 flex-wrap ">
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
        {/* 💡 LOAD MORE BUTTON */}
        <div className="flex justify-center w-full mt-8">
          {hasMore && (
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="w-40"
            >
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          )}
          {!hasMore && videos.length > 0 && (
            <p className="text-muted-foreground">You've reached the end!</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Homepage;
