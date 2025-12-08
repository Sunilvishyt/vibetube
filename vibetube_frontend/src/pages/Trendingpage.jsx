import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Trendingpage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", {
      state: {
        videoQuery: "trending",
      },
    });
  });
  return <div>Trendingpage</div>;
}

export default Trendingpage;
