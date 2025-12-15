import React from "react";
import { Clapperboard, Eye, Users } from "lucide-react";

function Infoblock({ videos, views, subscribers }) {
  // for common set of classes for the inner items
  const itemClasses = "flex flex-col items-center gap-1";

  return (
    <div className="w-[250px] flex justify-around bg-primary/90 p-4 rounded-2xl">
      <div className={itemClasses}>
        <Clapperboard className="text-white/90" />
        <h1 className="text-white text-2xl font-extrabold">{videos}</h1>
        <p className="text-white/90 text-sm ">videos</p>
      </div>

      <div className={itemClasses}>
        <Eye className="text-white/90" />
        <h1 className="text-white text-2xl font-extrabold">{views}</h1>
        <p className="text-sm text-white/90">views</p>
      </div>

      <div className={itemClasses}>
        <Users className="text-white/90" />
        <h1 className="text-white text-2xl font-extrabold">{subscribers}</h1>
        <p className="text-sm text-white/90">Matches</p>
      </div>
    </div>
  );
}

export default Infoblock;
