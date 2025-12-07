// SearchPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoCard from "@/components/my_components/VideoCard";
import { formatDistanceToNow, parseISO } from "date-fns";
import Navbar from "@/components/my_components/Navbar";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const q = query.get("q") || "";
  const pageParam = parseInt(query.get("page") || "1", 10);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(pageParam);
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
        const fetch = async () => {
          setLoading(true);
          try {
            const res = await axios.get("http://localhost:8000/search", {
              params: { query: q, page, limit: 24 },
            });
            setResults(res.data);
            setTotalEmpty(res.data.length === 0);
          } catch (err) {
            console.error(err);
            setResults([]);
          } finally {
            setLoading(false);
          }
        };
        fetch();
      }
    };

    initializePage();
  }, [q, page]);

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
      <div className="max-w-[1300px] mx-auto p-6 bg-chart-3 pb-23">
        <h2 className="text-lg font-semibold mb-4">Search results for “{q}”</h2>

        {loading ? (
          <div>Loading...</div>
        ) : totalEmpty ? (
          <div className="text-muted-foreground">No results found.</div>
        ) : (
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
                  video.user_avatar_url || "https://placehold.co/100"
                }
                views={video.views}
                uploadedAt={formatTimeAgo(video.created_at)}
              />
            ))}
          </div>
        )}

        {/* Simple pagination controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => {
              const next = page - 1;
              setPage(next);
              navigate(`/search?q=${encodeURIComponent(q)}&page=${next}`);
            }}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div>Page {page}</div>
          <button
            onClick={() => {
              const next = page + 1;
              setPage(next);
              navigate(`/search?q=${encodeURIComponent(q)}&page=${next}`);
            }}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
