import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function VideoCard({
  thumbnail,
  duration,
  title,
  channelName,
  channelAvatar,
  views,
  uploadedAt,
  tags = [],
}) {
  return (
    <Card className="w-full max-w-72 p-0 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer bg-background ">
      {/* Thumbnail */}
      <CardHeader className="p-0 relative">
        <div className="relative w-full aspect-video">
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-md">
            {duration}
          </span>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="flex gap-3 px-3 pt-4 pb-3 bg-muted">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={channelAvatar} />
          <AvatarFallback>
            {channelName?.[0]?.toUpperCase() || "C"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{channelName}</p>
          <p className="text-xs text-muted-foreground">
            {views} views • {uploadedAt}
          </p>
        </div>
      </CardContent>

      {/* Optional tags */}
      {tags.length > 0 && (
        <CardFooter className="flex gap-2 flex-wrap px-4 pb-1 pt-0">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}

/* ================== USAGE ==================

import VideoCard from "@/components/VideoCard";

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      <VideoCard
        thumbnail="https://picsum.photos/400/300"
        duration="12:45"
        title="How to build a YouTube style UI using shadcn + Tailwind"
        channelName="Harsh Dev"
        channelAvatar="https://picsum.photos/100"
        views="245K"
        uploadedAt="3 days ago"
        tags={["React", "shadcn", "Tailwind"]}
      />
    </div>
  );
}

*/
