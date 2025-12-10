// src/components/theme-provider.jsx

import { useEffect, useState } from "react";
// 👈 Import the context from the new file
import { ThemeProviderContext } from "../../lib/theme-context";

// The ThemeProviderContext definition and useTheme hook are now gone!

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  // 1. Get initial theme from local storage or use default
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // 2. Handle 'system' theme preference
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    // 3. Apply the selected theme
    root.classList.add(theme);
  }, [theme]);

  // 4. Create the context value
  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// 👈 useTheme is gone from here!

// This file now only exports the ThemeProvider component, satisfying the linter.
