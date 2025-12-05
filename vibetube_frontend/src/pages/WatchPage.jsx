// WatchPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow, parseISO } from "date-fns";
import Comments from "@/components/my_components/Comments";
import LikeButton from "@/components/my_components/LikeButton";

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate("/", { replace: true });
      return;
    }

    const fetchVideo = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/getvideo/${id}`);
        setVideo(res.data);
        document.title = res.data.title + " — MySite"; // SEO
      } catch (err) {
        setError("Video not found or server error");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!video) return null;

  const { title, description, video_url, views, created_at, username } = video;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden">
            {/* Use native video or react-player */}
            <video
              src={video_url}
              controls
              className="w-full h-[60vh] object-contain bg-black"
            />
          </div>

          <div className="mt-4">
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <img
                  src="https://placehold.co/40x40"
                  alt={username}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{username}</div>
                  <div className="text-xs text-muted-foreground">
                    {views} views •{" "}
                    {formatDistanceToNow(parseISO(created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LikeButton videoId={id} />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 rounded-md border"
                >
                  Share
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              {description}
            </div>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <Comments videoId={id} />
          </div>
        </div>

        {/* Right column — related / recommended */}
        <aside className="space-y-4">
          {/* Optionally reuse VideoCard for related, fetch /videos?related=... */}
          <div className="text-sm text-muted-foreground">Related videos</div>
          {/* Render small list, can reuse VideoCard with compact tweaks */}
        </aside>
      </div>
    </div>
  );
}
