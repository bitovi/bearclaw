import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    contrast?: string;
    states?: {
      focusVisible?: string;
    };
  }

  interface SimplePaletteColorOptions {
    contrast?: string;
    states?: {
      focusVisible?: string;
    };
  }

  interface Palette {
    appbar?: Palette["primary"];
  }

  interface PaletteOptions {
    appbar?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    buttonLarge: true;
    buttonMedium: true;
    buttonLargeOutlined: true;
    whiteOutlined: true;
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    action: {
      active: "rgba(0, 0, 0, 0.56)",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
    },
    primary: {
      main: "#0037FF",
      contrast: "#FFFFFF",
      states: {
        focusVisible: "rgba(0, 55, 255, 0.3)",
      },
    },
    secondary: {
      main: "rgba(0, 188, 212, 1)",
    },
    error: {
      main: "#D32F2F",
    },
  },
  typography: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    h2: {
      fontSize: "3.75rem",
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: "-0.09375rem",
    },
    h3: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "48px",
      lineHeight: "116.7%",
    },
    h4: {
      fontStyle: "normal",
      fontSize: "34px",
      fontWeight: 400,
      lineHeight: "123.5%",
      letterSpacing: "0.25px",
    },
    h5: {
      fontWeight: 400,
      fontStyle: "normal",
      fontSize: "1.5rem",
      lineHeight: "133.4%",
    },
    h6: {
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "20px",
      lineHeight: 1.6,
      letterSpacing: "0.15px",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.00625rem",
      lineHeight: "1.57",
    },
    body1: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "150%",
      letterSpacing: "0.15px",
    },
    body2: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "143%",
      letterSpacing: "0.17px",
    },
  },
  components: {
    MuiAppBar: {
      variants: [
        {
          props: {
            color: "primary",
          },
          style: {
            backgroundColor: "#F5F5F5",
          },
        },
      ],
    },
    MuiAlert: {
      variants: [
        {
          props: { variant: "standard" },
          style: {
            backgroundColor: "#D32F2F",
            color: "#FFFFFF",
          },
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-sizeSmall": {
            fontSize: "0.8125rem",
            padding: "4px 10px",
            borderRadius: "8px",
          },
        },
      },
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
            backgroundColor: "#0037FF",
            boxShadow:
              "0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
          },
        },
        {
          props: { variant: "buttonLarge" },
          style: {
            fontStyle: "Inter",
            fontWeight: 500,
            fontSize: "15px",
            lineHeight: "26px",
            letterSpacing: "0.46px",
            textTransform: "uppercase",
            backgroundColor: "#0037FF",
            fontColor: "#FFF",
            color: "#FFF",
            borderRadius: "8px",
            padding: "8px 22px",
            "&.Mui-disabled": {
              backgroundColor: "#cccccc",
            },
            "&:hover": {
              // until we get a styling for this, setting it to primary, default styling has it fading the color to an almost illegible text
              backgroundColor: "#0037FF",
            },
          },
        },
        {
          props: { variant: "buttonLargeOutlined" },
          style: {
            fontStyle: "Inter",
            fontWeight: 500,
            fontSize: "15px",
            lineHeight: "26px",
            letterSpacing: "0.46px",
            textTransform: "uppercase",
            backgroundColor: "transparent",
            color: "#0037FF",
            border: "1px solid #0037FF",
            borderRadius: "8px",
            padding: "8px 22px",
          },
        },
        {
          props: { variant: "buttonMedium" },
          style: {
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "24px",
            letterSpacing: "0.4px",
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1",
            },
          },
        },
        {
          props: { variant: "whiteOutlined" },
          style: {
            color: "white",
            backgroundColor: "transparent",
            border: "1px solid white",
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        },
      ],
    },
    // MuiInputLabel and MuiOutlinedInput set here to match consistent styling of "shrunk" input labels with placeholder text in input box
    MuiInputLabel: {
      defaultProps: { shrink: true },
    },
    MuiOutlinedInput: {
      defaultProps: {
        notched: true,
      },
    },
  },
});

export default theme;
