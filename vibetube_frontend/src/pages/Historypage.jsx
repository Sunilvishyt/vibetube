import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Historypage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", {
      state: {
        videoQuery: "history",
      },
    });
  });
  return <div>likedpage</div>;
}

export default Historypage;
