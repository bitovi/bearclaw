import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "./ThemeContext";

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        variant="text"
        onClick={toggleColorMode}
        color="inherit"
        sx={{ gap: "0.75rem" }}
      >
        {colorMode} mode
        {colorMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </Button>
    </Box>
  );
}
