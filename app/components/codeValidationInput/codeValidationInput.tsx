import Stack from "@mui/material/Stack";
import { useRef } from "react";
import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export const CodeValidationInput = ({
  name = "tokenCode",
  autoFocus = false,
  colorVariant = "light",
  containerProps,
}: {
  name?: string;
  autoFocus?: boolean;
  colorVariant?: "light" | "dark";
  containerProps?: BoxProps;
}) => {
  const digit1Ref = useRef<HTMLInputElement>(null);
  const inputBorder = "0.1rem solid";
  const inputBorderColor =
    colorVariant === "light" ? "white" : "text.secondary";
  const color = colorVariant === "light" ? "white" : "text.primary";

  return (
    <Stack
      direction="row"
      justifyContent={"center"}
      alignContent="center"
      paddingY={2}
      width="100%"
      position="relative"
      onClick={() => digit1Ref.current?.focus()}
    >
      <Box
        width={{ xs: "17.5rem", lg: "28rem" }}
        height="4rem"
        position="relative"
        {...containerProps}
      >
        <Box
          position="absolute"
          top="0.5rem"
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border={inputBorder}
          borderColor={inputBorderColor}
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "3rem", lg: "5rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border={inputBorder}
          borderColor={inputBorderColor}
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "6rem", lg: "10rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border={inputBorder}
          borderColor={inputBorderColor}
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "9rem", lg: "15rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border={inputBorder}
          borderColor={inputBorderColor}
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "12rem", lg: "20rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border={inputBorder}
          borderColor={inputBorderColor}
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "15rem", lg: "25rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border={inputBorder}
          borderColor={inputBorderColor}
          borderRadius="8px"
        />
        <TextField
          type="text"
          variant="standard"
          name={name}
          placeholder={"------"}
          autoFocus={autoFocus}
          inputRef={digit1Ref}
          InputProps={{
            disableUnderline: true,
            spellCheck: false,
            autoComplete: "off",
            sx: {
              backgroundColor: "transparent",
              color: color,
              fontFamily: `
              ui-monospace, 
              Menlo, Monaco, 
              "Cascadia Mono", 
              "Segoe UI Mono", 
              "Roboto Mono", 
              "Oxygen Mono", 
              "Ubuntu Monospace", 
              "Source Code Pro",
              "Fira Mono", 
              "Droid Sans Mono", 
              "Courier New", 
              monospace
              `,
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: { xs: "16px", lg: "24px" },
              letterSpacing: { xs: "2.42rem", lg: "4.375rem" },
              padding: "0",
              width: "100%",
              zIndex: "10",
              overflow: "hidden",
            },
          }}
          inputProps={{
            "aria-label": "token",
            height: "100%",
            maxLength: 6,
            width: "100%",
            sx: {
              textIndent: { xs: "0.875rem", lg: "1.68755rem" },
              caretColor: "transparent",
              padding: 0,
              "&::selection": {
                backgroundColor: "transparent",
              },
              "&::-moz-selection": {
                backgroundColor: "transparent",
              },
            },
          }}
          sx={{
            color: "#FFF",
            width: "100%",
            position: "absolute",
            left: 0,
            paddingTop: {
              xs: "1.05rem",
              lg: "1.75rem",
            },
          }}
        />
      </Box>
    </Stack>
  );
};
