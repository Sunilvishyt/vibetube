"use client";
import * as React from "react";
import { useEffect, useState, useRef, useId } from "react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import MoreButton from "@/components/my_components/MoreButton";
import { Themetoggle } from "@/components/my_components/Themetoggle";
import { ThemeToggleButton } from "../theme-toggle-button";

// Simple logo component for the navbar
const Logo = (props) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 324 323"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="88.1023"
        y="144.792"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 88.1023 144.792)"
        fill="currentColor"
      />
      <rect
        x="85.3459"
        y="244.537"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 85.3459 244.537)"
        fill="currentColor"
      />
    </svg>
  );
};

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Notification Menu Component
const NotificationMenu = ({ notificationCount = 3, onItemClick }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-9 w-9 relative">
        <BellIcon className="h-4 w-4" />
        {notificationCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {notificationCount > 9 ? "9+" : notificationCount}
          </Badge>
        )}
        <span className="sr-only">Notifications</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-80">
      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("notification1")}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">New message received</p>
          <p className="text-xs text-muted-foreground">2 minutes ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("notification2")}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">System update available</p>
          <p className="text-xs text-muted-foreground">1 hour ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("notification3")}>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Weekly report ready</p>
          <p className="text-xs text-muted-foreground">3 hours ago</p>
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("view-all")}>
        View all notifications
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// User Menu Component
const UserMenu = ({
  userName = "John Doe",
  userEmail = "john@example.com",
  userAvatar,
  onItemClick,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground"
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="text-xs">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <ChevronDownIcon className="h-3 w-3 ml-1" />
        <span className="sr-only">User menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {userEmail}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("profile")}>
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("settings")}>
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onItemClick?.("billing")}>
        Billing
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("logout")}>
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Default navigation links
const defaultNavigationLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/", label: "Entertainment" },
  { href: "/", label: "Gaming" },
  { href: "/", label: "Music" },
  { href: "/", label: "Tech" },
  { href: "/", label: "Education" },
  { href: "/", label: "News" },
  { href: "/", label: "Vlogs" },
];

export const Navbar08 = React.forwardRef(
  (
    {
      className,
      logo = <Logo />,
      navigationLinks = defaultNavigationLinks,
      searchPlaceholder = "Search...",
      userName = "John Doe",
      userEmail = "john@example.com",
      userAvatar,
      onNavItemClick,
      onUserItemClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef(null);
    const searchId = useId();
    const navigate = useNavigate();
    const location = useLocation();
    const activeQuery = location.state?.videoQuery || "random";
    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback(
      (node) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const query = (formData.get("search") || "").trim();
      if (!query) return;
      // send the user to /search?q=...
      navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    const handleUserMenuItemClick = (itemKey) => {
      if (itemKey === "logout") {
        // 1. Clear local storage (essential for a proper logout)
        localStorage.removeItem("access_token");

        // 2. Execute navigation
        navigate("/logout", { replace: true });
      }

      if (itemKey === "profile") {
        navigate(`/profile/${props.id}`, { state: { editOptions: true } });
      }

      // 3. Call the original external prop (if it was provided)
      if (onUserItemClick) {
        onUserItemClick(itemKey);
      }
    };

    const handleNavItemClickInternal = (e, linkHref, label) => {
      e.preventDefault();

      // Check if the link is our designated route link (e.g., '/')
      if (linkHref === "/" && label === "Home") {
        navigate("/", { replace: true, state: { videoQuery: "random" } });
        return;
      } else if (linkHref === "/" && label === "Entertainment") {
        navigate("/", {
          replace: true,
          state: { videoQuery: "entertainment" },
        });
        return;
      } else if (linkHref === "/" && label === "Gaming") {
        navigate("/", { replace: true, state: { videoQuery: "gaming" } });
        return;
      } else if (linkHref === "/" && label === "Music") {
        navigate("/", { replace: true, state: { videoQuery: "music" } });
        return;
      } else if (linkHref === "/" && label === "Tech") {
        navigate("/", { replace: true, state: { videoQuery: "tech" } });
        return;
      } else if (linkHref === "/" && label === "Education") {
        navigate("/", { replace: true, state: { videoQuery: "education" } });
        return;
      } else if (linkHref === "/" && label === "News") {
        navigate("/", { replace: true, state: { videoQuery: "news" } });
        return;
      } else if (linkHref === "/" && label === "Vlogs") {
        navigate("/", { replace: true, state: { videoQuery: "vlogs" } });
        return;
      }

      // For all other links, use the external handler prop if provided
      if (onNavItemClick && linkHref) {
        onNavItemClick(linkHref);
      }
    };

    const sheetNavLinks = [
      { name: "🔥 Trending", href: "/trending" },
      { name: "❤️ Liked Videos", href: "/liked" },
      { name: "🕒 History", href: "/history" },
      { name: "ℹ️ About vibetube", href: "/about" },
    ];

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline",
          className
        )}
        {...props}
      >
        <div className="container mx-auto max-w-screen-2xl">
          {/* Top section */}
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left side */}
            <div className="flex flex-1 items-center gap-2">
              {/* Mobile menu trigger */}
              {isMobile && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="group h-8 w-8 hover:bg-accent hover:text-accent-foreground"
                      variant="ghost"
                      size="icon"
                    >
                      <HamburgerIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-64 p-1">
                    <NavigationMenu className="max-w-none">
                      <NavigationMenuList className="flex-col items-start gap-0">
                        {navigationLinks.map((link, index) => (
                          <NavigationMenuItem key={index} className="w-full">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (onNavItemClick && link.href)
                                  onNavItemClick(link.href);
                              }}
                              className={cn(
                                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline",
                                ((activeQuery === "random" &&
                                  link.label === "Home") ||
                                  link.label.toLowerCase() === activeQuery) &&
                                  "bg-accent text-accent-foreground"
                              )}
                            >
                              {link.label}
                            </button>
                          </NavigationMenuItem>
                        ))}
                      </NavigationMenuList>
                    </NavigationMenu>
                  </PopoverContent>
                </Popover>
              )}
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
                >
                  <div className="text-2xl">{logo}</div>
                  <span className="hidden font-bold text-xl sm:inline-block">
                    vibetube
                  </span>
                </button>
              </div>
            </div>
            {/* Middle area */}
            <div className="grow">
              {/* Search form */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative mx-auto w-full max-w-xs"
              >
                <Input
                  id={searchId}
                  name="search"
                  className="peer h-8 ps-8 pe-10  w-96 max-w-110 rounded-2xl"
                  placeholder={searchPlaceholder}
                  type="search"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
                  {/* <kbd className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {searchShortcut}
                  </kbd> */}
                </div>
              </form>
            </div>

            {/* Right side */}
            <div className="flex flex-1 items-center justify-end gap-1">
              {/* Notification
              <NotificationMenu
                notificationCount={notificationCount}
                onItemClick={onNotificationItemClick}
              /> */}
              <span>
                <Tooltip>
                  <TooltipTrigger>
                    <Themetoggle />
                  </TooltipTrigger>
                  <TooltipContent>Toggle theme</TooltipContent>
                </Tooltip>
              </span>
              <span className="flex justify-center items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/upload");
                      }}
                    >
                      <Upload cursor="pointer" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload video</TooltipContent>
                </Tooltip>
              </span>
              {/* User menu */}
              <UserMenu
                userName={userName}
                userEmail={userEmail}
                userAvatar={userAvatar}
                onItemClick={handleUserMenuItemClick}
              />
            </div>
          </div>
          {/* Bottom navigation */}
          {!isMobile && (
            <div className="border-t py-2 flex">
              <div className="pr-14 pl-12 pt-1.5 flex justify-center">
                <Sheet>
                  <SheetTrigger asChild>
                    {/* Using a Menu icon is often better than "More" text for a small button */}
                    <Button
                      className="group h-8 w-8 hover:bg-accent hover:text-accent-foreground"
                      variant="ghost"
                      size="icon"
                    >
                      {/* If using lucide-react, you can use: <Menu className="h-5 w-5" /> */}
                      <span className="font-bold">
                        <MoreButton />
                      </span>{" "}
                      {/* Placeholder for an icon */}
                    </Button>
                  </SheetTrigger>
                  {/* Adjusted width here: max-w-xs is a common max-width for a sidebar */}
                  <SheetContent
                    side="left"
                    className="w-64 max-w-xs sm:max-w-sm pr-2"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-bold border-b pb-2 mb-4">
                        Navigation
                      </SheetTitle>
                      <SheetDescription className="sr-only">
                        Navigation links for key pages.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col space-y-2 ml-3">
                      {sheetNavLinks.map((link) => (
                        // Navigation links with better styling
                        <a
                          key={link.name}
                          href={link.href}
                          className="
                  flex items-center 
                  px-3 py-2 
                  text-sm font-medium 
                  rounded-md 
                  text-foreground 
                  hover:bg-muted 
                  transition-colors 
                  duration-150
                "
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              {/* Navigation menu */}
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        href={link.href}
                        onClick={(e) => {
                          handleNavItemClickInternal(e, link.href, link.label);
                        }}
                        className={cn(
                          "text-muted-foreground hover:text-primary py-1.5 font-medium transition-colors cursor-pointer group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          // 1. Check if it's the default 'Home' and activeQuery is 'random'
                          ((activeQuery === "random" &&
                            link.label === "Home") || // 2. Check if the link label matches the category query
                            link.label.toLowerCase() === activeQuery) &&
                            "text-primary bg-accent/50"
                        )}
                        data-active={link.active}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}
        </div>
      </header>
    );
  }
);

Navbar08.displayName = "Navbar08";

export { Logo, HamburgerIcon, NotificationMenu, UserMenu };
