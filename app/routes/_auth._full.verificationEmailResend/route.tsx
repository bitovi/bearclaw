import Typography from "@mui/material/Typography";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "~/components/link";
import { sendVerificationToken } from "~/models/verificationToken.server";

export async function loader({ request }: LoaderArgs) {
  await sendVerificationToken(request);

  return json({ showFakeMail: process.env.EMAIL_USE_DEV });
}

export default function Route() {
  const { showFakeMail } = useLoaderData<typeof loader>();

  return (
    <div>
      <Typography>Verification email resent!</Typography>
      {showFakeMail ? (
        <Typography mt={2}>
          TESTING: Email messaging is not connected yet.{" "}
          <Typography component={Link} to="/fakeMail" color="secondary.main">
            View verification emails here
          </Typography>
        </Typography>
      ) : null}
    </div>
  );
}
