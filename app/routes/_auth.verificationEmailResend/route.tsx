import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
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
      <p>Verification email resent!</p>
    </div>
  );
}
