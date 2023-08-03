import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect, useContext, createContext, useMemo } from "react";
import { getTheme } from "./theme";

export type ColorMode = "light" | "dark";

export function isColorMode(
  mode: string | null | undefined
): mode is ColorMode {
  return !!mode && ["light", "dark"].includes(mode);
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
  const [mode, setMode] = useState<ColorMode | undefined>();

  useEffect(() => {
    if (mode === undefined) {
      const storedMode = localStorage.getItem("colorMode") || undefined;
      console.log("storedMode", storedMode);
      if (isColorMode(storedMode)) {
        setMode(storedMode);
      } else if (prefersDarkMode) {
        setMode("dark");
      }
    }
  }, [mode, prefersDarkMode]);

  const context = useMemo(
    () => ({
      colorMode: mode || "light",
      setColorMode: (colorMode: ColorMode) => {
        localStorage.setItem("colorMode", colorMode);
        setMode(colorMode);
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
    <ColorModeContext.Provider value={context}>
      <MuiThemeProvider theme={getTheme(mode)}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
