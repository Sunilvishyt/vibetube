import React from "react";
import { Skeleton } from "../ui/skeleton";

function WatchPageSkeleton() {
  return (
    <div className="p-5 flex gap-4">
      <div className="w-3/4">
        <Skeleton className="h-5/7 rounded-2xl mb-4" />
        <Skeleton className="h-1/5  rounded-2xl" />
      </div>
      <div className="h-screen w-1/4">
        <Skeleton className="h-full " />
      </div>
    </div>
  );
}

export default WatchPageSkeleton;
