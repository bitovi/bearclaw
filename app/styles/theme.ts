import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    h5: {
      fontSize: "0.875rem",
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    h6: {
      fontSize: "0.75rem",
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    subtitle2: {
      fontSize: "20px",
      fontWeight: 500,
      letterSpacing: "0.15px",
    },
    body2: {
      color: "#00000099",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            color: "primary",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "24px",
            paddingY: "6px",
            paddingX: "16px",
            borderRadius: "4px",
            backgroundColor: "#2196F3",
            boxShadow:
              "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            color: "#2196F3",
          },
        },
      ],
    },
  },
});

export default theme;
