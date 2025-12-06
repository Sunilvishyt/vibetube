import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const logoutfnc = () => {
      console.log("loggin out");

      localStorage.removeItem("access_token");
      navigate("/login", {
        replace: true,
        state: {
          successMessage: "Successfully logged out",
          fromLogout: true,
        },
      });
    };
    logoutfnc();
  });
  return <div>Logging out....</div>;
}

export default Logout;
