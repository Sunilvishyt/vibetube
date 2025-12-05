import React from "react";
import { Navbar08 } from "@/components/ui/shadcn-io/navbar-08";

function Navbar(props) {
  return (
    <div className="relative w-full">
      <Navbar08 userName={props.userName} userEmail={props.userEmail} />
    </div>
  );
}

export default Navbar;
