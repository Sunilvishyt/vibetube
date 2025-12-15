import React from "react";
import { CheckCircle, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  // Ensures flush connection to the content below
  <div className={`flex flex-col space-y-1.5 p-0 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-0 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);

const Avatar = ({ children, className = "" }) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 ${className}`}
  >
    {children}
  </div>
);

const AvatarImage = ({ src, className = "" }) => (
  <img
    src={src}
    alt="Avatar"
    className={`aspect-square h-full w-full object-cover ${className}`}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "https://placehold.co/100x100/e5e7eb/374151?text=C";
    }}
  />
);

const AvatarFallback = ({ children, className = "" }) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, className = "", variant = "default" }) => {
  let style = "bg-gray-800 text-white hover:bg-gray-700/80";
  if (variant === "secondary") {
    style = "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${style} ${className}`}
    >
      {children}
    </span>
  );
};

// --- Video Card Component ---
const VideoCard = ({
  id,
  thumbnail,
  duration,
  title,
  channelName,
  channelAvatar,
  views,
  uploadedAt,
  tags = [],
}) => {
  // Defensive check
  if (!thumbnail) return null;

  return (
    <Link to={`/watch/${id}`} className="block">
      <Card className="w-59 h-60 p-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer bg-background">
        {/* Thumbnail */}
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-video ">
            <img
              src={thumbnail}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/640x360/4f46e5/ffffff?text=Video`;
              }}
            />
          </div>
          {duration && (
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md font-medium">
              {duration}
            </span>
          )}
        </CardHeader>

        {/* Content - Using px-4 for consistent alignment, using bg-white for seamless look */}
        <CardContent className="flex gap-3 pl-3 px-4 pt-4 pb-3 bg-background">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={channelAvatar} />
            <AvatarFallback>
              {channelName?.[0]?.toUpperCase() || "C"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Title and Options Menu */}
            <div className="flex justify-between items-start -mt-1 -mr-2">
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-accent-foreground pr-1">
                {title}
              </h3>
              {/* Options Menu Icon */}
              <MoreVertical className="w-4 h-4 text-accent-foreground hover:text-gray-900 transition-colors shrink-0" />
            </div>

            {/* Channel Name with Verified Icon */}
            <p className="text-xs text-accent-foreground mt-1 flex items-center">
              {channelName}
              <CheckCircle className="w-3 h-3 ml-1 text-blue-500 fill-white" />
            </p>
            {/* Views and Upload Date */}
            <p className="text-xs text-gray-500">
              {views} views • {uploadedAt}
            </p>
          </div>
        </CardContent>

        {tags.length > 0 && (
          <CardFooter className="flex gap-1 flex-wrap px-4 pb-4 pt-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-[10px] h-5"
              >
                {tag}
              </Badge>
            ))}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};
export default VideoCard;
