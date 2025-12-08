import { Menu } from "lucide-react";
const MoreButton = () => {
  return (
    <div className="flex items-center justify-center">
      <NeumorphismButton />
    </div>
  );
};

const NeumorphismButton = () => {
  return (
    <button
      className={`
        px-4 py-[6px] pr-5 rounded-full 
        flex items-center gap-2 
        text-white bg-chart-1
        shadow-[-3px_-3px_5px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
        
        transition-all

        hover:shadow-[-1px_-1px_3px_rgba(255,_255,_255,_0.4),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
        hover:text-primary hover:bg-background
    `}
    >
      <Menu />
      <span>More</span>
    </button>
  );
};

export default MoreButton;
