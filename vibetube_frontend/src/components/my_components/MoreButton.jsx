// File: MoreButton.jsx (or wherever NeumorphismButton is defined)
import { Menu } from "lucide-react";

const NeumorphismWrapper = (props) => {
  return (
    <div
      {...props} // This spreads all props (including the onClick, aria-controls, etc. from SheetTrigger)
      className={`
        // Apply your unique Neumorphism styling here:
        px-4 py-[6px] pr-5 rounded-full 
        flex items-center gap-2 
        text-white bg-chart-1
        shadow-[-3px_-3px_5px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
        
        transition-all

        hover:shadow-[-1px_-1px_3px_rgba(255,_255,_255,_0.4),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
        hover:text-primary hover:bg-background
        // Crucially, append the received className to this class list
        ${props.className || ""} 
      `}
    >
      <Menu className="h-4 w-4" />
      <span>More</span>
    </div>
  );
};

const MoreButton = (props) => {
  // Pass props down to the wrapper
  return (
    <div className="flex items-center justify-center">
      <NeumorphismWrapper {...props} />
    </div>
  );
};

export default MoreButton;
