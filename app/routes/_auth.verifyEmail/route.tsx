import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Link } from "~/components/link";
import { validateUserEmailByToken } from "~/models/user.server";
import { safeRedirect } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (token) {
    const result = await validateUserEmailByToken(token);
    if (result.error) {
      return json({ isVerified: false, error: "Could not verify. Token is expired or invalid." });
    }
    const redirectTo = url.searchParams.get("redirectTo");
    if (redirectTo) {
      return json({ isVerified: true, error: null, redirectTo: safeRedirect(redirectTo) });
    }
    return json({ isVerified: true, error: null, redirectTo: "/dashboard" });
  }
  return json({ isVerified: false, error: null, redirectTo: null });
}

export default function Route() {
  const { isVerified, error, redirectTo } = useLoaderData();

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
