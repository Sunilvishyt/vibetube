import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Subscribebutton({ channelId }) {
  // State for the number of subscribers
  const [count, setCount] = useState(0);
  // State for whether the current user is subscribed
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  // EFFECT: Fetch initial subscription status and count.
  useEffect(() => {
    if (!channelId) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      // If no token, we navigate to login as the backend API is authenticated.
      console.log("Not authenticated. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchSubscription = async () => {
      try {
        setLoading(true);

        // API call to get subscriber count and current user's status
        const res = await axios.get(
          `http://localhost:8000/subscribers/${channelId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.owner_watching == "True") setDisabled(true);
        setCount(res.data.subscribers);

        // Convert the string response ("true" or "false") to boolean
        setIsSubscribed(res.data.subscribed === "true");
      } catch (err) {
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          console.error(
            "Authentication failed during initial subscription fetch."
          );
          navigate("/login");
        } else {
          console.error("Error fetching initial subscription status:", err);
          // If the backend returns a 404/400 for a channel that doesn't exist, handle it here.
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [channelId, navigate]);

  // HANDLER: Toggles the subscription state and interacts with the API
  async function toggleSubscription() {
    if (loading) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("User not authenticated. Redirecting to login.");
      navigate("/login");
      return;
    }

    setLoading(true);

    // --- Optimistic Update ---
    const previousSubscribed = isSubscribed;
    const previousCount = count;

    // Toggle the subscribed state immediately
    setIsSubscribed((prev) => !prev);

    // Update the count optimistically
    setCount((prev) => (previousSubscribed ? prev - 1 : prev + 1));

    try {
      await axios.post(
        `http://localhost:8000/subscribe`,
        // Send the ID of the channel owner to the backend
        { user_id: channelId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Success: Optimistic update is maintained.
    } catch (err) {
      console.error(
        "Error toggling subscription status. Reverting state.",
        err
      );

      // Revert the Optimistic Update if the API call fails
      setIsSubscribed(previousSubscribed);
      setCount(previousCount);

      // Specifically handle backend errors like trying to subscribe to self
      if (err.response && err.response.status === 400) {
        alert(
          "Action failed: The channel owner cannot subscribe to their own channel."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // --- Button Rendering Logic ---

  // Common button classes
  const buttonClasses = isSubscribed
    ? "bg-primary/88 text-white  hover:bg-gray-600" // Subscribed (darker/subtle)
    : "bg-muted text-foreground hover:bg-sidebar-ring/80"; // Not subscribed (prominent)

  const buttonText = isSubscribed ? "Matched" : "Match";

  return (
    <button
      onClick={toggleSubscription}
      disabled={loading || disabled}
      className={`px-4 py-1.5 rounded-2xl border cursor-pointer flex items-center justify-center space-x-2 font-semibold transition-colors duration-200 ${buttonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : isSubscribed ? (
        <Check size={18} className="text-white" />
      ) : (
        <UserPlus size={18} className="text-foreground" />
      )}
      <div className="text-sm">{buttonText}</div>
      {/* Show count only if not loading and it's greater than 0, or always show 0 */}
      <div className="text-sm font-light">| {count}</div>
    </button>
  );
}
