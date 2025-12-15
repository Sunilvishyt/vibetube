// SearchPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoCard from "@/components/my_components/VideoCard";
import { formatDistanceToNow, parseISO } from "date-fns";
import Navbar from "@/components/my_components/Navbar";

const VIDEOS_PER_BATCH = 12;
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const q = query.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalEmpty, setTotalEmpty] = useState(false);
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
        navigate("/login", {
          replace: true,
          state: {
            fromSearch: true,
            errorMessage: "login expired, please login again",
          },
        });
        return false; // Stop execution here
      }
    }
  };

  const fetchVideos = async (query, fetchOffset, isLoadMore = false) => {
    // Only show full page spinner on initial load, otherwise show button loading
    if (!isLoadMore) {
      setLoading(true);
    }

    try {
      const res = await axios.get("http://localhost:8000/search", {
        params: {
          query: query,
          offset: fetchOffset, // Use offset instead of page
          limit: VIDEOS_PER_BATCH,
        },
      });

      const newVideos = res.data;

      // Update video state: APPEND if loading more, REPLACE if a new search query
      setResults((prevResults) =>
        isLoadMore ? [...prevResults, ...newVideos] : newVideos
      );

      // Update offset for the next request
      setOffset(fetchOffset + newVideos.length);

      // Check if we received less than the requested limit, which means no more data
      setHasMore(newVideos.length === VIDEOS_PER_BATCH);

      // Check for total emptiness only on the initial load (offset 0)
      if (fetchOffset === 0) {
        setTotalEmpty(newVideos.length === 0);
      }
    } catch (err) {
      console.error(err);
      // On error, clear results and set hasMore to false
      if (fetchOffset === 0) setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!q) {
      // No query — redirect back or show message
      setResults([]);
      setTotalEmpty(true);
      return;
    }

    const initializePage = async () => {
      const isAuthenticated = await verify_token();
      if (isAuthenticated) {
        setResults([]);
        setOffset(0);
        setHasMore(true);

        // 3. Fetch the first batch (offset 0)
        fetchVideos(q, 0, false);
      }
    };

    initializePage();
  }, [q]);

  const handleLoadMore = () => {
    if (hasMore) {
      // Use the tracked offset to fetch the next batch. The 'true' flag means append.
      fetchVideos(q, offset, true);
    }
  };

  function formatTimeAgo(timestamp) {
    try {
      return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
    } catch {
      return "";
    }
  }

  if (!q) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">No search query</h2>
        <p className="text-muted-foreground">
          Type something in the search box.
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar userName={username} userEmail={email} />
      <div className="flex w-full mx-auto p-6 bg-chart-3 pb-23 justify-center">
        <div className="flex-row w-[90vw]  max-w-[1050px] gap-1 flex-wrap justify-center">
          <h2 className="text-lg font-semibold mb-4">
            Search results for “{q}”
          </h2>

          {loading && results.length === 0 ? ( // Only show main loading spinner if no results have been loaded yet
            <div>Loading...</div>
          ) : totalEmpty ? (
            <div className="text-muted-foreground">No results found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    thumbnail={video.thumbnail_url}
                    duration={video.duration || "0:00"}
                    title={video.title}
                    channelName={video.username}
                    channelAvatar={
                      video.owner.profile_image || "https://placehold.co/100"
                    }
                    views={video.views}
                    uploadedAt={formatTimeAgo(video.created_at)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              <div className="flex justify-center w-full mt-8">
                {hasMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={loading} // Use 'loading' state as Load More button loading
                    className="w-40 px-3 py-1 border rounded disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                )}
                {!hasMore && results.length > 0 && (
                  <p className="text-muted-foreground">
                    You've reached the end!
                  </p>
                )}
              </div>
            </>
          )}

          {/* Remove the old pagination controls here */}
          {/* ... */}
        </div>
      </div>
    </>
  );
}
