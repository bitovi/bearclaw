import { useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { Button } from "~/components/button/Button";
import { TextInput } from "~/components/input/text/TextInput";
import { MFA_TYPE, isMfaType } from "~/models/mfa";
import { getUserMfaMethods, resetMfaToken, validateAndDestroyMfaToken } from "~/models/mfa.server";
import { getMfaStatus, getUser, mfaActivateUserSession } from "~/session.server";
import { safeRedirect } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  if (!user) return redirect("/login");

  const mfaStatus = await getMfaStatus(request);
  if (mfaStatus !== "pending") return redirect("/dashboard");

  const mfaMethods = await getUserMfaMethods(user);
  const activeMfaMethods = mfaMethods.filter((mfa) => mfa.active && mfa.verifiedAt).map((mfa) => mfa.type);

  return json({ activeMfaMethods });
}

export async function action({ request }: LoaderArgs) {
  const user = await getUser(request);
  if (!user) return redirect("/login");

  const formData = await request.formData();
  const type = formData.get("type");
  const reset = formData.get("reset");

  if (
    type &&
    typeof type === "string" &&
    isMfaType(type) &&
    reset &&
    typeof reset === "string" &&
    reset === "true"
  ) {
    await resetMfaToken({ type, user })
    return json({
      reset: true,
      errors: { token: null }
    })
  }

  const token = formData.get("token");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (
    token &&
    typeof token === "string" &&
    type &&
    typeof type === "string" &&
    isMfaType(type)
  ) {
    const tokenValid = await validateAndDestroyMfaToken({
      user,
      type,
      token
    });

    if (tokenValid) {
      return await mfaActivateUserSession({ request, redirectTo });
    }
  }

  return json(
    {
      reset: false,
      errors: {
        token:
          "Could not verify MFA token. Retry or request a new token.",
      },
    },
    { status: 400 }
  );
}

export default function Mfa() {
  const { activeMfaMethods } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const tokenRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h1>Login</h1>
      {activeMfaMethods.includes("email") ? (
        <Box display="flex" flexDirection="column" gap="1rem">
          <Typography variant="h3">Email MFA</Typography>
          <Typography>
            You have been sent a 6 digit token to your email address. Please enter it below to complete the login process.
          </Typography>
          <Form method="post">
            <TextInput
              name="token"
              label="MFA Token"
              inputRef={tokenRef}
              autoFocus={true}
              error={actionData?.errors?.token || ''}
            />
            <input type="hidden" name="type" value={MFA_TYPE.EMAIL} />
            <Button type="submit" variant="contained" sx={{ display: "block", mt: "1rem" }}>
              Complete
            </Button>
          </Form>
          <Form method="post">
            <input type="hidden" name="type" value={MFA_TYPE.EMAIL} />
            <input type="hidden" name="reset" value="true" />
            <Button type="submit" variant="outlined" sx={{ display: "block", mt: "1rem" }}>
              Resend MFA Token
            </Button>
            <Typography variant="caption">
              This will invalidate any previously sent tokens.
            </Typography>
            {actionData?.reset === true && (
              <Typography variant="caption">
                New token sent.
              </Typography>
            )}
          </Form>
        </Box>
      ) : (
        <div>
          <h2>Email MFA</h2>
          <p>DISABLED</p>
        </div>
      )}
    </div>
  );
}