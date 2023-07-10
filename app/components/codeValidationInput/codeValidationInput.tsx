import Stack from "@mui/material/Stack";
import { useRef } from "react";
import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export const CodeValidationInput = ({
  autoFocus = false,
  containerProps,
}: {
  autoFocus?: boolean;
  containerProps?: BoxProps;
}) => {
  const digit1Ref = useRef<HTMLInputElement>(null);

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
        width={{ xs: "20.5rem", lg: "28rem" }}
        height="4rem"
        position="relative"
        {...containerProps}
      >
        <Box
          position="absolute"
          top="0.5rem"
          // left={{ xs: "0.7rem", lg: "unset" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border="0.1rem solid #FFF"
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "3rem", lg: "5rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border="0.1rem solid #FFF"
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "6rem", lg: "10rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border="0.1rem solid #FFF"
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "9rem", lg: "15rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border="0.1rem solid #FFF"
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "12rem", lg: "20rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border="0.1rem solid #FFF"
          borderRadius="8px"
        />
        <Box
          position="absolute"
          top="0.5rem"
          left={{ xs: "15rem", lg: "25rem" }}
          height={{ xs: "2.50rem", lg: "4rem" }}
          width={{ xs: "2.50rem", lg: "4rem" }}
          border="0.1rem solid #FFF"
          borderRadius="8px"
        />
        <TextField
          type="text"
          variant="standard"
          name="tokenCode"
          placeholder={"------"}
          autoFocus={autoFocus}
          inputRef={digit1Ref}
          InputProps={{
            disableUnderline: true,
            spellCheck: false,
            autoComplete: "off",
            sx: {
              backgroundColor: "transparent",
              color: "#FFF",
              fontFamily: "Inter",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: { xs: "16px", lg: "24px" },
              letterSpacing: { xs: "2.5rem", lg: "4.5rem" },
              padding: "0",
              width: "130%",
              zIndex: "10",
              overflow: "hidedn",
            },
          }}
          inputProps={{
            height: "100%",
            maxLength: 6,
            width: "100%",
            sx: {
              textIndent: { xs: "1.15rem", lg: "1.5rem" },
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
              xs: "1rem",
              lg: "1.65rem",
            },
          }}
        />
      </Box>
    </Stack>
  );
};
