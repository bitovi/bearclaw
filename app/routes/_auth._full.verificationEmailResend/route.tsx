import Typography from "@mui/material/Typography";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Link } from "~/components/link";
import { resetEmailValidationToken } from "~/models/user.server";
import { getUser } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  invariant(user, "User is required");
  await resetEmailValidationToken(user);

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
