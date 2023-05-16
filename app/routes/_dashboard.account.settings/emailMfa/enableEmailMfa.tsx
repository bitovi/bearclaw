import { Form, useActionData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button } from "~/components/button/Button";
import { requireUser } from "~/session.server";
import { updateUserMfaMethod, verifyMfaMethod } from "~/models/mfa.server";
import { MFA_TYPE } from "~/models/mfa";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextInput } from "~/components/input";
import type { User } from "@prisma/client";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  await updateUserMfaMethod({
    user,
    type: MFA_TYPE.EMAIL,
    active: true,
  });

  return json({});
}
export async function enableEmailMfaAction(request: ActionArgs["request"]) {
  const user = await requireUser(request);
  await updateUserMfaMethod({
    user,
    type: MFA_TYPE.EMAIL,
    active: true,
  });

  return json({ form: "emailMfaEnable", success: true });
}

export async function verifyEmailMfaAction(
  user: User,
  token: FormDataEntryValue | null | string
) {
  if (user && token && typeof token === "string") {
    const mfaMethod = await verifyMfaMethod({
      user,
      type: MFA_TYPE.EMAIL,
      token
    });

    return json({ form: "emailMfaVerify", success: !!mfaMethod });
  }

  return json({ form: "emailMfaVerify", success: false });
}

export function VerifyEmailMfa({ mfaEmailStatus }: { mfaEmailStatus: string }) {
  const response = useActionData<typeof enableEmailMfaAction>();

  if (response?.success && response.form === "emailMfaVerify") {
    return (
      <Box my={2} display="flex" flexDirection="column" gap="1rem">
        <Typography fontWeight="700">Email MFA Enabled</Typography>
        <Typography>
          Email MFA has been enabled successfully for your account.
        </Typography>
      </Box>
    );
  }

  if (mfaEmailStatus === "not verified") {
    return (
      <Box my={2} display="flex" flexDirection="column" gap="1rem">
        <Typography fontWeight="700">Enable Email MFA</Typography>
        <Typography>
          You have been sent a 6 digit token to your email address. Please enter it below to enable email MFA.
        </Typography>
        <Form method="post">
          <TextInput
            name="token"
            label="MFA Token"
            error={(response?.success === false && response.form === "emailMfaVerify") ? "Invalid token, please try again." : undefined}
          />
          <input type="hidden" name="form" value="emailMfaVerify" />
          <Button type="submit" variant="contained" sx={{ display: "block", mt: "1rem" }}>Verify</Button>
        </Form>
        <Form method="post">
          <input type="hidden" name="action" value="emailMfaEnable" />
          <Button type="submit">Resend Code</Button>
        </Form>
      </Box>
    );
  }

  return null
}

