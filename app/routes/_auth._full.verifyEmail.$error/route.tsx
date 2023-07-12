import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

export async function loader({ params }: LoaderArgs) {
  console.log("LOG LOG LOG LOG ------- _auth._full.verifyEmail.$error loader");

  invariant(params.error, "Error status is required");

  return json({ error: params.error });
}

export default function Route() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div>
      {error === "expired" ? (
        <p>Your email verification link has expired.</p>
      ) : (
        <p>There was an error verifying your email.</p>
      )}
    </div>
  );
}
