import { useTheme } from "@/lib/theme-context";
import { ThemeToggleButton } from "../ui/shadcn-io/theme-toggle-button";
import { useThemeTransition } from "../ui/shadcn-io/theme-toggle-button";

export function Themetoggle() {
  const { theme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();
  const handle = () => {
    startTransition(() => {
      setTheme(theme === "light" ? "dark" : "light");
    });
  };
  return (
    <ThemeToggleButton
      theme={theme} // "light" or "dark"
      onClick={handle}
      variant="circle-blur" // you can choose "circle", "circle-blur", etc
      start="top-right" // where animation originates
    />
  );
}
