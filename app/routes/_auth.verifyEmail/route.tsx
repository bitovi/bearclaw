import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLoaderData } from "@remix-run/react";
import { LoaderArgs, json, redirect } from "@remix-run/server-runtime";
import { Link } from "~/components/link";
import { validateUserEmailByToken } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (token) {
    const result = await validateUserEmailByToken(token);
    if (result.error) {
      return json({ isVerified: false, error: "Could not verify. Token is expired or invalid." });
    }
    return json({ isVerified: true, error: null });
  }
  return json({ isVerified: false, error: null });
}

export default function Route() {
  const { isVerified, error } = useLoaderData();

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
        <Link to="/dashboard">Continue to dashboard</Link>
      </Box>
    );
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
      {error ? (
        <Typography>
          {error}
        </Typography>
      ) : (
        <Typography>
          Please verify your email address. Check your inbox for a
          verification link.
        </Typography>
      )}
      <Link to="/verificationEmailResend">
        Resend verification email
      </Link>
      <Typography>
        TESTING: Email messaging is not connected yet.{" "}
        <Link to="/fakeMail">View verification emails here</Link>
      </Typography>
    </Box>
  )
}
