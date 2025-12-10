import { createContext, useContext } from "react";

const initialState = { theme: "light", setTheme: () => {} };
export const ThemeProviderContext = createContext(initialState);
export const useTheme = () => {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
