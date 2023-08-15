import Typography from "@mui/material/Typography";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Link } from "~/components/link";
import { resetVerificationToken } from "~/models/verificationToken.server";
import { getOrgandUserId, getUser } from "~/session.server";
import { safeRedirect } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const { organizationId } = await getOrgandUserId(request);

  const url = new URL(request.url);
  const redirectTo = safeRedirect({
    to: url.searchParams.get("redirectTo"),
    orgId: organizationId,
  });
  invariant(user, "User is required");
  await resetVerificationToken(user, redirectTo);

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
