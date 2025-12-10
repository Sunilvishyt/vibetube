// src/lib/theme-context.js

import { createContext, useContext } from "react";

const initialState = {
  theme: "system",
  setTheme: () => null,
};

// 1. Create and export the Context
export const ThemeProviderContext = createContext(initialState);

// 2. Create and export the Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
