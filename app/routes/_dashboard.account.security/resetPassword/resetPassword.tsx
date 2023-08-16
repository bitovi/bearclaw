import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useActionData, Form } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import {
  createVerificationToken,
  sendVerificationTokenEmail,
} from "~/models/verificationToken.server";
import { requireUser } from "~/session.server";
import { Button } from "~/components/button";
import { FORM } from "../route";
import { SetNewPassword } from "./setNewPassword";
import { ValidateToken } from "./validateToken";
import { ResetSuccess } from "./resetSuccess";

export async function resetPasswordTokenAction(request: ActionArgs["request"]) {
  const user = await requireUser(request);
  const { token } = await createVerificationToken(user.id);
  await sendVerificationTokenEmail(user.email, token);

  return json({ form: FORM.CREATE_RESET_TOKEN, success: true });
}

export function ResetPassword() {
  const response = useActionData();

  if (
    (response?.success && response.form === FORM.CREATE_RESET_TOKEN) ||
    (response?.success === false && response.form === FORM.VALIDATE_RESET_TOKEN)
  ) {
    return <ValidateToken error={response?.success === false} />;
  } else if (
    (response?.success && response.form === FORM.VALIDATE_RESET_TOKEN) ||
    (response?.success === false && response.form === FORM.RESET_PASSWORD)
  ) {
    return <SetNewPassword />;
  } else if (response?.success && response.form === FORM.RESET_PASSWORD) {
    return <ResetSuccess />;
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5">Reset Password</Typography>
        <Typography variant="body2">
          We'll email you a link to reset your password. You will need to verify
          your account once more to complete this process.
        </Typography>
      </Box>
      <Form method="post">
        <input type="hidden" name="form" value={FORM.CREATE_RESET_TOKEN} />
        <Button type="submit" variant="contained">
          Reset Password
        </Button>
      </Form>
    </Stack>
  );
}
