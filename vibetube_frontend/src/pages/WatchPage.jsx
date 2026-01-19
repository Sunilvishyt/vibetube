// WatchPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Comments from "@/components/my_components/Comments";
import LikeButton from "@/components/my_components/LikeButton";
import Subscribebutton from "@/components/my_components/Subscribebutton";
import { Link } from "react-router-dom";
import api from "@/api/axios";

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
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/auth/login", {
            replace: true,
            state: {
              fromWatch: true,
              errorMessage: "login expired, please login again",
            },
          });
        }
        await api.post(
          "/view",
          { video_id: id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const res = await api.get(`/getvideo/${id}`);
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

  const { title, description, user_id, video_url, views, created_at, owner } =
    video;

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
                <Link to={`/profile/${user_id}`}>
                  <img
                    src={owner.profile_image}
                    alt={owner.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </Link>
                <div>
                  <div className="font-black text-foreground/80">
                    {owner.username}
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
            <div className="bg-accent rounded-lg p-2 w-full">
              <Collapsible>
                <CollapsibleTrigger className="w-full flex items-center justify-between [&[data-state=open]>svg]:rotate-180">
                  Description
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 transition-transform duration-200"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* RIGHT: Comments ONLY */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg shadow-sm p-4 h-full overflow-y-auto max-h-screen">
            <Comments videoId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
