import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useActionData, Form } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useState } from "react";
import { CodeValidationInput } from "~/components/codeValidationInput";
import { createVerificationToken, sendVerificationTokenEmail } from "~/models/verificationToken.server";
import { requireUser } from "~/session.server";
import { Button } from "~/components/button";
import { FORM } from "../route";
import { TextInput } from "~/components/input";

export async function resetPasswordTokenAction(request: ActionArgs["request"]) {
  const user = await requireUser(request);
  const { token } = await createVerificationToken(user.id);
  await sendVerificationTokenEmail(user.email, token);

  return json({ form: FORM.CREATE_RESET_TOKEN, success: true });
}

export function ResetPassword() {
  const response = useActionData<typeof resetPasswordTokenAction>();
  const [showForm, setShowForm] = useState(false);

  if (response?.success && response.form === FORM.CREATE_RESET_TOKEN) {
    return (
      <Box>
        <Box>
          <Typography variant="h5">Reset your password</Typography>
          <Typography variant="body2">
            We've emailed a 6-digit confirmation code,
            please enter the code below to verify your account and continue.
          </Typography>
        </Box>
        <input type="hidden" name="form" value="validateToken" />
        <Form method="post">
          <Stack spacing={2}>
            <input type="hidden" name="form" value={FORM.VALIDATE_RESET_TOKEN} />
            <CodeValidationInput colorVariant="dark" />
            <Box>
              <Button onClick={() => setShowForm(true)} type="submit" variant="contained">
                Confirm
              </Button>
            </Box>
          </Stack>
        </Form>
        <Form method="post">
          <input type="hidden" name="form" value={FORM.CREATE_RESET_TOKEN} />
          <Typography variant="body1">
            Don’t have a code?
            <Button type="submit" variant="text">Resend code</Button>
          </Typography>
        </Form>
        <Form method="post">
          <input type="hidden" name="form" value={FORM.CANCEL} />
          <Button type="submit" variant="text">Cancel</Button>
        </Form>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5">Reset your password</Typography>
        <Typography variant="body2">
          We'll email you a link to reset your password.
          You will need to verify your account once more to complete this
          process.
        </Typography>
      </Box>

      {showForm ? (
        <Form method="post">
          <input type="hidden" name="form" value={FORM.RESET_PASSWORD} />
          <Stack spacing={2}>
            <TextInput
              label="New Password"
              name="newPassword"
              type="password"
            />
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
            />
            <Button type="submit">Reset Password</Button>
          </Stack>
        </Form>
      ) : (
        <Form method="post">
          <input type="hidden" name="form" value={FORM.CREATE_RESET_TOKEN} />
          <Button type="submit" variant="contained">Reset Password</Button>
        </Form>
      )}
    </Stack>
  );
}
