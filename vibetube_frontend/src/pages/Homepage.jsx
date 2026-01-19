import React from "react";
import Navbar from "@/components/my_components/navbar";
import VideoCard from "@/components/my_components/VideoCard";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast, Toaster } from "sonner";
import { CircleX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlurText from "@/components/ui/shadcn-io/blur-text";
import api from "@/api/axios";
const VIDEOS_PER_PAGE = 12;

function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(-1);
  const [profileurl, setProfileUrl] = useState("");

  //  Keep track of the current offset (which page we are on)
  const [offset, setOffset] = useState(0);

  // Track if there are more videos to load (if the last fetch returned less than limit)
  const [hasMore, setHasMore] = useState(true);
  const [sentVideoIds, setSentVideoIds] = useState(new Set());

  //  Track the currently active category/query
  const [currentQuery, setCurrentQuery] = useState(
    location.state?.videoQuery || "random",
  );
  const [whichPage, setWhichPage] = useState(
    location.state?.whichPage || "For Your Vibe",
  );
  //  Loading state for the Load More button
  const [isLoading, setIsLoading] = useState(false);
  const [videosLoading, setvideosLoading] = useState(true);

  const verify_token = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/auth/login", {
        replace: true,
        state: {
          errorMessage: "Please login to continue!",
          fromHomepage: true,
        },
      });
      return false;
    }

    try {
      const res = await api.get("/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = res.data.details.username;
      const user_email = res.data.details.email;
      setUsername(user);
      setId(res.data.details.id);
      setEmail(user_email);
      setProfileUrl(res.data.details.profile_image);
      return true;
    } catch (error) {
      //  Handle Errors (401 Unauthorized, 403 Forbidden, etc.)
      const statusCode = error.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        localStorage.removeItem("access_token"); // Clean up stored token
        navigate("/auth/login", {
          replace: true,
          state: {
            errorMessage: "Login Expired, Please login again",
            fromHomepage: true,
          },
        });
        return false;
      }
    }
  };

  const fetchVideos = async (
    query,
    fetchOffset,
    isLoadMore = false,
    videosloading = false,
  ) => {
    setIsLoading(true); // Start loading
    if (videosloading) setvideosLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      let excludeParam = Array.from(sentVideoIds).join(",");
      const response = await api.get(
        `/getvideos/${query}?limit=${VIDEOS_PER_PAGE}&offset=${fetchOffset}&exclude_ids=${excludeParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const newVideos = response.data;

      // Update video state: APPEND if loading more, REPLACE if a new category
      setVideos((prevVideos) =>
        isLoadMore ? [...prevVideos, ...newVideos] : newVideos,
      );

      // Update offset for the next request
      setOffset(fetchOffset + newVideos.length);

      // Update the sentVideoIds Set
      setSentVideoIds((prevIds) => {
        const updated = new Set(prevIds);
        newVideos.forEach((v) => updated.add(v.id));
        return updated;
      });

      //  Check if we received less than the requested limit, which means no more data
      setHasMore(newVideos.length === VIDEOS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setvideosLoading(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      const isAuthenticated = await verify_token();

      if (isAuthenticated) {
        const vidQuery = location.state?.videoQuery || "random";
        setWhichPage(location.state?.whichPage || "For Your Vibe");

        if (vidQuery !== currentQuery) {
          // Reset pagination state for a new category
          setVideos([]); // Clearing old videos
          setOffset(0);
          setHasMore(true);
          setCurrentQuery(vidQuery); // Update tracking query
          setSentVideoIds(new Set());

          // Fetch the first batch for the new category (offset 0)
          fetchVideos(vidQuery, 0, false, true);
        } else if (videos.length === 0) {
          fetchVideos(vidQuery, 0, false, true);
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
        <div className="bg-gradient-to-r from-primary to-chart-1 text-white p-3 pl-5 rounded-xl shadow-2xl w-full max-w-sm">
          <div className="flex items-center gap-3">
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
              <CircleX />
            </button>
          </div>
        </div>
      ));

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.successMessage, location.pathname, navigate]);

  function formatTimeAgo(timestamp) {
    const date = parseISO(timestamp);
    const now = new Date();
    const diffMs = now - date; // difference in milliseconds

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    // fallback to formatDistanceToNow for weeks, months, years
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Navbar
        userName={username}
        userEmail={email}
        id={id}
        userAvatar={profileurl}
      />
      <hr />
      <div className="bg-chart-3 min-h-screen h-fit w-full p-8">
        {videosLoading ? (
          <div className="flex w-full mt-[20vh] justify-center items-center">
            <Loader2 className="animate-spin size-15 text-primary" />
          </div>
        ) : videos.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground">
            Videos not available :(
          </div>
        ) : (
          <div>
            <BlurText
              className="font-bold size-18 text-3xl w-full ml-2"
              text={whichPage}
              stepDuration="0.5"
            />
            <div className="flex justify-center w-full">
              <div className="flex w-[85vw] max-w-[1100px] gap-6 flex-wrap ">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    thumbnail={video.thumbnail_url}
                    duration={video.duration}
                    title={video.title}
                    channelName={video.owner.username}
                    channelAvatar={video.owner.profile_image}
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
        )}
      </div>
    </>
  );
}

export default Homepage;
