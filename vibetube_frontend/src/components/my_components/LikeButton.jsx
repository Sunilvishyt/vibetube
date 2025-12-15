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
  // State for the loading indicator
  const [loading, setLoading] = useState(false);

  // FIX 1: Call useNavigate as a hook
  const navigate = useNavigate();

  // EFFECT: Fetchint initial like status and count when the component mounts or videoId changes.
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
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

        if (res.data.liked === "true") {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (err) {
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
  }, [videoId, navigate]);

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

    const previousLiked = liked;
    const previousCount = count;

    setLiked((prev) => !prev);

    setCount((prev) => (previousLiked ? prev - 1 : prev + 1));

    try {
      await axios.post(
        `http://localhost:8000/like`,
        { video_id: videoId, type: "like" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error toggling like status. Reverting state.", err);

      setLiked(previousLiked);
      setCount(previousCount);
    } finally {
      setLoading(false);
    }
  }

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
