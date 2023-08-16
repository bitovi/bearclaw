import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { Button } from "~/components/button/Button";
import { MFA_TYPE, isMfaType } from "~/models/mfa";
import {
  getUserMfaMethods,
  resetMfaToken,
  validateAndDestroyMfaToken,
} from "~/models/mfa.server";
import {
  getMfaStatus,
  getOrgandUserId,
  getUser,
  mfaActivateUserSession,
} from "~/session.server";
import { safeRedirect } from "~/utils";
import { CodeValidationInput } from "~/components/codeValidationInput";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const { organizationId } = await getOrgandUserId(request);

  if (!user) return redirect("/login");

  const mfaStatus = await getMfaStatus(request);
  if (mfaStatus !== "pending") return redirect(`/${organizationId}/dashboard`);

  const mfaMethods = await getUserMfaMethods(user);

  const activeMfaMethods = mfaMethods
    .filter((mfa) => mfa.active && mfa.verifiedAt)
    .map((mfa) => mfa.type);

  if (activeMfaMethods.length === 0) {
    const url = new URL(request.url);
    const redirectTo = safeRedirect({
      to: url.searchParams.get("redirectTo"),
      defaultRedirect: `/${organizationId}/dashboard`,
    });
    return await mfaActivateUserSession({ request, redirectTo });
  }

  return json({ activeMfaMethods });
}

export async function action({ request }: LoaderArgs) {
  const user = await getUser(request);
  const { organizationId } = await getOrgandUserId(request);

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
    await resetMfaToken({ type, user });
    return json({
      reset: true,
      errors: { token: null },
    });
  }

  const token = formData.get("token");
  const redirectTo = safeRedirect({
    to: formData.get("redirectTo"),
    defaultRedirect: `/${organizationId}/dashboard`,
  });

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
      token,
    });

    if (tokenValid) {
      return await mfaActivateUserSession({ request, redirectTo });
    }
  }

  return json(
    {
      reset: false,
      errors: {
        token: "Could not verify MFA token. Retry or request a new token.",
      },
    },
    { status: 400 }
  );
}

export default function Mfa() {
  const { activeMfaMethods } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const error = actionData?.errors?.token || "";
  return (
    <div>
      {activeMfaMethods.includes("email") ? (
        <Box
          display="flex"
          flexDirection="column"
          gap="1rem"
          alignItems="center"
        >
          <Typography variant="h3">Email MFA</Typography>
          <Typography>
            You have been sent a 6 digit token to your email address. Please
            enter it below to complete the login process.
          </Typography>
          <Form method="post">
            <Stack spacing={4} alignItems="center">
              <CodeValidationInput name="token" autoFocus={true} />
              {error && <FormHelperText error>{error}</FormHelperText>}
              <input type="hidden" name="type" value={MFA_TYPE.EMAIL} />
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ display: "block", mt: "1rem" }}
                >
                  Complete
                </Button>
              </Box>
            </Stack>
          </Form>
          <Form method="post">
            <Stack spacing={2} alignItems="center">
              <input type="hidden" name="type" value={MFA_TYPE.EMAIL} />
              <input type="hidden" name="reset" value="true" />
              <Box>
                <Button
                  type="submit"
                  variant="text"
                  sx={{ color: "white", mt: "1rem" }}
                >
                  Resend MFA Token
                </Button>
              </Box>
              <Typography variant="caption">
                This will invalidate any previously sent tokens.
              </Typography>
              {actionData?.reset === true && (
                <Typography variant="caption">New token sent.</Typography>
              )}
            </Stack>
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
