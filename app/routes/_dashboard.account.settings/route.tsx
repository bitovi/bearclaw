import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useColorMode } from "~/styles/ThemeContext";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export async function loader({ request }: LoaderArgs) {
  return json({});
}

export default function Settings() {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Box>
      <Typography variant="h5">Dark Mode</Typography>
      <Typography variant="body2">
        Customize your experience by switching between light mode and dark mode.
      </Typography>

      <Box component={FormGroup} mt={2}>
        <FormControlLabel
          label="Dark Mode"
          control={
            <Switch
              checked={colorMode === "dark"}
              onChange={(event) =>
                setColorMode(event.target.checked ? "dark" : "light")
              }
            />
          }
        />
      </Box>
    </Box>
  );
}
