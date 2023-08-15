import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createResetPasswordToken } from "~/models/user.server";
import { validateVerificationToken } from "~/models/verificationToken.server";
import { requireUser } from "~/session.server";
import { FORM } from "../route";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Form } from "@remix-run/react";
import Stack from "@mui/material/Stack";
import { Button } from "~/components/button";
import { CodeValidationInput } from "~/components/codeValidationInput";
import { FormHelperText } from "@mui/material";

export async function validateTokenAction(
  request: ActionArgs["request"],
  formData: FormData
) {
  const user = await requireUser(request);
  const form = formData.get("form");
  const token = formData.get("token");
  invariant(form === FORM.VALIDATE_RESET_TOKEN, "Invalid form");
  invariant(token && typeof token === "string", "Token is required");
  const validatedToken = await validateVerificationToken(token, user.id);
  if (!validatedToken) {
    return json({ form, token: null, success: false });
  }
  const { token: newToken } = await createResetPasswordToken(user);

  return json({ form, token: newToken, success: true });
}

export function ValidateToken({ error }: { error?: boolean }) {
  return (
    <Box>
      <Box>
        <Typography variant="h5">Reset Password</Typography>
        <Typography variant="body2">
          We've emailed a 6-digit confirmation code, please enter the code below
          to verify your account and continue.
        </Typography>
      </Box>
      <input type="hidden" name="form" value="validateToken" />
      <Form method="post">
        <Stack spacing={2}>
          <input type="hidden" name="form" value={FORM.VALIDATE_RESET_TOKEN} />
          <CodeValidationInput colorVariant="dark" name="token" />
          {error && <FormHelperText error>Invalid code</FormHelperText>}
          <Box>
            <Button type="submit" variant="contained">
              Confirm
            </Button>
          </Box>
        </Stack>
      </Form>
      <Form method="post">
        <input type="hidden" name="form" value={FORM.CREATE_RESET_TOKEN} />
        <Typography variant="body1">
          Don’t have a code?
          <Button type="submit" variant="text">
            Resend code
          </Button>
        </Typography>
      </Form>
      <Form method="post">
        <input type="hidden" name="form" value={FORM.CANCEL} />
        <Button type="submit" variant="text">
          Cancel
        </Button>
      </Form>
    </Box>
  );
}
