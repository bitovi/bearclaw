import { Form, useActionData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button } from "~/components/button/Button";
import { requireUser } from "~/session.server";
import { updateUserMfaMethod, verifyMfaMethod } from "~/models/mfa.server";
import { MFA_TYPE } from "~/models/mfa";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { User } from "@prisma/client";
import { FORM } from "../route";
import { CodeValidationInput } from "~/components/codeValidationInput";
import { FormHelperText, Stack } from "@mui/material";

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

  return json({ form: FORM.EMAIL_MFA_ENABLE, success: true });
}

export async function verifyEmailMfaAction(
  user: User,
  token: FormDataEntryValue | null | string
) {
  if (user && token && typeof token === "string") {
    const mfaMethod = await verifyMfaMethod({
      user,
      type: MFA_TYPE.EMAIL,
      token,
    });

    return json({ form: FORM.EMAIL_MFA_VERIFY, success: !!mfaMethod });
  }

  return json({ form: FORM.EMAIL_MFA_VERIFY, success: false });
}

export function VerifyEmailMfa({ mfaEmailStatus }: { mfaEmailStatus: string }) {
  const response = useActionData();

  if (response?.success && response.form === FORM.EMAIL_MFA_VERIFY) {
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
    const error =
      response?.success === false && response.form === FORM.EMAIL_MFA_VERIFY
        ? "Invalid token, please try again."
        : undefined;

    return (
      <Stack spacing={2}>
        <Typography variant="body2">
          You have been sent a 6 digit token to your email address. Please enter
          it below to enable email MFA.
        </Typography>
        <Form method="post">
          <Stack spacing={4}>
            <CodeValidationInput colorVariant="dark" name="token" />
            {error && <FormHelperText error>{error}</FormHelperText>}
            <input type="hidden" name="form" value={FORM.EMAIL_MFA_VERIFY} />
            <Box>
              <Button type="submit" variant="contained">
                Verify Code
              </Button>
            </Box>
          </Stack>
        </Form>
        <Form method="post">
          <input type="hidden" name="action" value={FORM.EMAIL_MFA_ENABLE} />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Typography variant="body1">Don’t have a code?</Typography>
            <Button type="submit" variant="text">
              Resend Code
            </Button>
          </Box>
        </Form>
      </Stack>
    );
  }

  return null;
}
