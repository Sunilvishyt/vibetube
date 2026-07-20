import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Trendingpage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", {
      state: {
        videoQuery: "trending",
        whichPage: "Trending Vibes",
      },
    });
  });
  return null;
}

export { Trendingpage as Component };

// export default Trendingpage;
