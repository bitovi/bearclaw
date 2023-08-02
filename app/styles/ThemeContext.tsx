import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect, useContext, createContext, useMemo } from "react";
import { getTheme } from "./theme";

export type ColorMode = "light" | "dark";

export function isColorMode(mode: string): mode is ColorMode {
  return ["light", "dark"].includes(mode);
}

export interface ColorModeContextData {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextData>({
  colorMode: "light",
  setColorMode: (mode: ColorMode) => {},
  toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<ColorMode>();

  useEffect(() => {
    if (mode === undefined) {
      const storedMode = localStorage.getItem("colorMode") || undefined;
      if (storedMode && ["light", "dark"].includes(storedMode)) {
        storedMode === "dark" && setMode("dark");
      } else if (prefersDarkMode) {
        setMode("dark");
      }
    }
  }, [mode, prefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      colorMode: mode || "light",
      setColorMode: (mode: ColorMode) => {
        localStorage.setItem("colorMode", mode);
        setMode(mode);
      },
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = !prevMode || prevMode === "light" ? "dark" : "light";
          localStorage.setItem("colorMode", newMode);
          return newMode;
        });
      },
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={getTheme(mode)}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
