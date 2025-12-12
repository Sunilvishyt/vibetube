// WatchPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow, parseISO } from "date-fns";

import Comments from "@/components/my_components/Comments";
import LikeButton from "@/components/my_components/LikeButton";
import Subscribebutton from "@/components/my_components/Subscribebutton";

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [fetchedViews, setFetchedViews] = useState(0);

  useEffect(() => {
    if (!id) {
      navigate("/", { replace: true });
      return;
    }

    const fetchVideo = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login", {
            replace: true,
            state: {
              fromWatch: true,
              errorMessage: "login expired, please login again",
            },
          });
        }
        await axios.post(
          "http://localhost:8000/view",
          { video_id: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const res = await axios.get(`http://localhost:8000/getvideo/${id}`);
        setVideo(res.data);
        document.title = `${res.data.title} — MySite`;
      } catch {
        setError("Video not found or server error");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="p-8 w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error) return <div className="p-8 text-destructive">{error}</div>;
  if (!video) return null;

  const {
    title,
    description,
    user_id,
    video_url,
    views,
    created_at,
    username,
  } = video;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Video + Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black rounded-lg overflow-hidden shadow-md border border-border">
            <video
              src={video_url}
              controls
              autoPlay
              className="w-full aspect-video object-contain bg-black"
            />
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm space-y-4">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://placehold.co/40x40"
                  alt={username}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-black text-foreground/80">
                    {username}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {views} views •{" "}
                    {formatDistanceToNow(parseISO(created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <Subscribebutton channelId={user_id} />
              </div>

              <div className="flex items-center gap-3">
                <LikeButton videoId={id} />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-1.5 rounded-md border border-border bg-muted hover:bg-accent transition text-sm"
                >
                  Share
                </button>
              </div>
            </div>
            <div className="bg-accent rounded-lg p-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Comments ONLY */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 h-full overflow-y-auto max-h-[100vh]">
            <Comments videoId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
