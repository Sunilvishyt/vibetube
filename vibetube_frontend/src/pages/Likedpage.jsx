import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Likedpage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", {
      state: {
        videoQuery: "liked",
      },
    });
  });
  return <div>likedpage</div>;
}

export default Likedpage;
