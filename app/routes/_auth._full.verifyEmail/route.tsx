import Box from "@mui/material/Box";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Typography from "@mui/material/Typography";
import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Link } from "~/components/link";
import { validateUserEmailByToken } from "~/models/user.server";
import { safeRedirect } from "~/utils";
import { Button } from "~/components/button";
import Stack from "@mui/material/Stack";
import { TextInput } from "~/components/input";
import type { TextFieldProps } from "@mui/material/TextField";
import { useRef } from "react";
import React from "react";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (token) {
    const result = await validateUserEmailByToken(token);
    if (result.error) {
      return json({
        isVerified: false,
        error: "Could not verify. Token is expired or invalid.",
      });
    }
    const redirectTo = url.searchParams.get("redirectTo");
    if (redirectTo) {
      return json({
        isVerified: true,
        error: null,
        redirectTo: safeRedirect(redirectTo),
      });
    }
    return json({ isVerified: true, error: null, redirectTo: "/dashboard" });
  }
  return json({ isVerified: false, error: null, redirectTo: null });
}
const CodeInputBox = React.forwardRef<
  HTMLInputElement,
  Partial<TextFieldProps>
>((props, ref) => {
  return (
    <TextInput
      inputRef={ref}
      variant="standard"
      inputProps={{
        maxLength: 1,
        type: "text",
        sx: {
          textAlign: "center",
        },
      }}
      InputProps={{
        disableUnderline: true,
        sx: {
          color: "#FFF",
        },
      }}
      sx={{
        width: "56px",
        height: "56px",
        display: "flex",
        flexDirection: "row",
        borderRadius: "8px",
        border: "1px solid #FFF",
        color: "#FFF",
      }}
      {...props}
    />
  );
});

export default function Route() {
  const { isVerified, error, redirectTo } = useLoaderData();
  const digit2Ref = useRef<HTMLInputElement>(null);
  const digit3Ref = useRef<HTMLInputElement>(null);
  const digit4Ref = useRef<HTMLInputElement>(null);
  const digit5Ref = useRef<HTMLInputElement>(null);
  const digit6Ref = useRef<HTMLInputElement>(null);

  if (isVerified === true) {
    return (
      <Box
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <Typography>Email verified successfully!</Typography>
        <Link to={redirectTo}>Continue to dashboard</Link>
      </Box>
    );
  }
  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
    >
      <Typography variant="h5">Please check your email!</Typography>
      <Typography variant="body2">
        We've emailed a 6-digit confirmation code to acb@domain, please enter
        the code below to verify your account.
      </Typography>
      <Form>
        <Stack
          paddingY={4}
          direction="row"
          width="100%"
          gap={2}
          justifyContent={"center"}
          alignItems="center"
          alignSelf="stretch"
        >
          <CodeInputBox
            onChange={(e) => {
              if (e.target.value.length === 1) {
                digit2Ref.current?.focus();
              }
            }}
            name={"digit1"}
            autoFocus
          />
          <CodeInputBox
            ref={digit2Ref}
            onChange={(e) => {
              if (e.target.value.length === 1) {
                digit3Ref.current?.focus();
              }
            }}
            name={"digit2"}
          />
          <CodeInputBox
            ref={digit3Ref}
            onChange={(e) => {
              if (e.target.value.length === 1) {
                digit4Ref.current?.focus();
              }
            }}
            name={"digit3"}
          />
          <CodeInputBox
            ref={digit4Ref}
            onChange={(e) => {
              if (e.target.value.length === 1) {
                digit5Ref.current?.focus();
              }
            }}
            name={"digit4"}
          />
          <CodeInputBox
            ref={digit5Ref}
            onChange={(e) => {
              if (e.target.value.length === 1) {
                digit6Ref.current?.focus();
              }
            }}
            name={"digit5"}
          />
          <CodeInputBox ref={digit6Ref} name={"digit6"} />
        </Stack>
        <Button type="submit" variant="buttonLarge" color="primary">
          VERIFY
        </Button>
      </Form>
      <Box>
        <Typography component="span" variant="body2">
          Don't have a code?{" "}
        </Typography>
        <Typography
          component={Link}
          to="/verificationEmailResend"
          color="secondary.main"
          variant="body2"
        >
          Resend code
        </Typography>
      </Box>
      <ButtonLink
        variant="buttonMedium"
        to="/login"
        sx={{
          "&:hover": { backgroundColor: "#FFF" },
          color: "primary.main",
        }}
      >
        <KeyboardArrowLeftIcon />
        Return to Sign In
      </ButtonLink>
      <br />
      <br />
      <br />
      <Typography>
        TESTING: Email messaging is not connected yet.{" "}
        <Typography component={Link} to="/fakeMail" color="secondary.main">
          View verification emails here
        </Typography>
      </Typography>
    </Box>
  );
}
