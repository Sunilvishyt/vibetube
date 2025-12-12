import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThumbsUp } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LikeButton({ videoId }) {
  // State for the number of likes
  const [count, setCount] = useState(0);
  // State for whether the current user has liked the video
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // FIX 1: Call useNavigate as a hook
  const navigate = useNavigate();

  // EFFECT: Fetch initial like status and count when the component mounts or videoId changes.
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      // If no token, do not attempt API call; maybe disable button or show 0 likes
      console.log("Not authenticated. Skipping initial like fetch.");
      navigate("/login");
      return;
    }

    const fetchLikes = async () => {
      try {
        setLoading(true);

        // Fetch like status and total count for the video
        const res = await axios.get(`http://localhost:8000/likes/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCount(res.data.likes);

        // Convert the string response ("true" or "false") from the backend to boolean
        if (res.data.liked === "true") {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (err) {
        // Handle token expiration errors gracefully here if the backend returns 401/403
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          console.error("Authentication failed during initial like fetch.");
          navigate("/login");
        } else {
          console.error("Error fetching initial like status:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [videoId, navigate]); // videoId ensures data refreshes when watching a new video

  // HANDLER: Toggles the like state and interacts with the API
  async function toggleLike() {
    if (loading) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("User not authenticated. Redirecting to login.");
      navigate("/login");
      return;
    }

    setLoading(true);

    // --- Optimistic Update ---
    const previousLiked = liked;
    const previousCount = count;

    // Toggle the liked state immediately
    setLiked((prev) => !prev);

    // FIX 2: Corrected Count Logic
    // If it was previously liked (we are UNLIKING), decrement count.
    // If it was not previously liked (we are LIKING), increment count.
    setCount((prev) => (previousLiked ? prev - 1 : prev + 1));

    try {
      await axios.post(
        `http://localhost:8000/like`,
        { video_id: videoId, type: "like" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Success: The optimistic update is maintained.
    } catch (err) {
      console.error("Error toggling like status. Reverting state.", err);

      // Revert the Optimistic Update if the API call fails
      setLiked(previousLiked);
      setCount(previousCount);
    } finally {
      setLoading(false);
    }
  }

  // Determine button appearance using Tailwind classes
  const buttonClasses = liked
    ? "bg-primary text-white hover:bg-primary/80"
    : "bg-muted text-foreground  hover:bg-muted/90";

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`px-3 py-1 rounded-lg border cursor-pointer flex items-center justify-center space-x-1 font-semibold transition-colors duration-200 ${buttonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <Loader2 size={17} className="animate-spin" />
      ) : (
        <ThumbsUp
          size={17}
          className="mr-2"
          fill={liked ? "white" : "currentColor"}
        />
      )}
      <div>{count}</div>
    </button>
  );
}
