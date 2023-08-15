import Typography from "@mui/material/Typography";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
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

  return json({});
}

export default function Route() {
  return (
    <div>
      <Typography>Verification email resent!</Typography>
      <Typography>
        TESTING: Email messaging is not connected yet.{" "}
        <Link to="/fakeMail">View verification emails here</Link>
      </Typography>
    </div>
  );
}
