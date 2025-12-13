import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Infoblock from "@/components/my_components/Infoblock";
import { CircleCheckBig, CalendarFold, Loader2 } from "lucide-react"; // Added Loader2
import Subscribebutton from "@/components/my_components/Subscribebutton";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { parseISO } from "date-fns/parseISO";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/my_components/VideoCard";
import { useParams } from "react-router-dom";

// NOTE: You'll need a mechanism (like useParams or a global user state)
// to get the actual Channel ID/Username of the profile you are viewing.
// For this example, we'll assume a fixed `CHANNEL_ID` and `CHANNEL_USERNAME`
// or you can pass it in as a prop later.

const VIDEOS_PER_PAGE = 12;

function Profilepage() {
  // --- STATE ---
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [subscribers, setSubscribers] = useState(0);
  const [views, setViews] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [joinedDate, setJoinedDate] = useState("");
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { id } = useParams();
  // --- UTILITIES ---

  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/channeldetails/${id}`
      );
      setUsername(response.data.username);
      setDescription(response.data.channel_description);
      setJoinedDate(formatIsoDate(response.data.created_at));
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchMoreDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8000/morechanneldetails/${id}`
      );
      setSubscribers(response.data.total_subscribers);
      setViews(response.data.total_views);
      setTotalVideos(response.data.total_videos);
    } catch (error) {
      console.error("Error fetching more details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchVideos = useCallback(
    async (fetchOffset, isLoadMore = false) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `http://localhost:8000/getvideos/ChannelVideos?limit=${VIDEOS_PER_PAGE}&offset=${fetchOffset}&channel_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newVideos = response.data;

        // Ensure no duplicates if merging logic is complex (simple append here)
        setVideos((prevVideos) =>
          isLoadMore ? [...prevVideos, ...newVideos] : newVideos
        );

        // Update offset for the next request
        setOffset(fetchOffset + newVideos.length);

        // Check if we received less than the requested limit
        setHasMore(newVideos.length === VIDEOS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  const handleLoadMore = () => {
    fetchVideos(offset, true); // Use the tracked offset
  };

  // Utility function for date formatting (using date-fns directly now)
  const formatVideoTimeAgo = useCallback((timestamp) => {
    try {
      const date = parseISO(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Time unknown";
    }
  }, []);

  const formatIsoDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
      day: "numeric", // e.g., 6
      month: "long", // e.g., January
      year: "numeric", // e.g., 2025
    };
    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    fetchUserDetails();
    fetchMoreDetails();
    fetchVideos(0, false);
  }, [fetchVideos, fetchUserDetails, fetchMoreDetails]);

  if (videos.length === 0 && isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-chart-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-lg text-foreground">Loading channel...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-fit flex justify-center bg-chart-3 pt-8">
      <div>
        {/* === CHANNEL HEADER === */}
        <div className="flex justify-between p-4 w-[80vw] min-w-[500px] max-w-[1000px] gap-6 border-b border-border mb-8">
          <div className="flex">
            <div className="pt-2 pr-8 shrink-0">
              <Avatar className="h-28 w-28 border-2 border-primary">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>

            <div>
              <div className="flex items-center ">
                <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance pb-3 mr-3">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    username
                  )}
                </h1>
                <CircleCheckBig className="pb-1 text-primary" />
              </div>

              <div className="pb-4 text-balance text-sm">
                <p>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    description
                  )}
                </p>
              </div>

              <div className="flex items-center gap-1 pb-4 text-[15px] text-balance">
                <CalendarFold size={15} />
                {/* Replace static text with channelData.join_date if fetched */}
                <p>joined ● {joinedDate}</p>
              </div>

              <div>
                <Subscribebutton channelId={id} />
              </div>
            </div>
          </div>

          {/* Info Block (Videos, Views, Subscribers) */}
          <div className="hidden sm:block">
            {" "}
            {/* Hide on smaller screens */}
            <Infoblock
              videos={totalVideos}
              views={views}
              subscribers={subscribers}
            />
          </div>
        </div>

        {/* === VIDEO GRID === */}
        <div className=" h-fit w-full p-4 bg-muted rounded-t-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4 ml-6 max-w-[1000px] mx-auto text-foreground">
            Videos ({videos.length})
          </h2>

          <div className="flex justify-center w-full">
            {/* Using CSS Grid for better responsiveness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 w-[85vw] max-w-[1400px]">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  thumbnail={video.thumbnail_url}
                  duration={video.duration}
                  title={video.title}
                  channelName={video.username}
                  channelAvatar="https://picsum.photos/100"
                  views={video.views}
                  uploadedAt={formatVideoTimeAgo(video.created_at)}
                />
              ))}
            </div>
          </div>

          {/* LOAD MORE BUTTON / END MESSAGE */}
          <div className="flex justify-center w-full mt-10">
            {hasMore && (
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-40 h-10 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Load More"
                )}
              </Button>
            )}
            {!hasMore && videos.length > 0 && (
              <p className="text-muted-foreground p-3">
                You've reached the end of the channel's videos!
              </p>
            )}
            {videos.length === 0 && !isLoading && (
              <p className="text-muted-foreground p-3">
                This channel has no videos yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profilepage;
