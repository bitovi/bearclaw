import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { resetPasswordByToken } from "~/models/user.server";
import { requireUser } from "~/session.server";
import { FORM } from "../route";
import { Form, useActionData } from "@remix-run/react";
import { Button } from "~/components/button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { validateTokenAction } from "./validateToken";
import { getUserPasswordError } from "~/utils";
import { PasswordInput } from "./passwordInput";

export async function resetPasswordAction(
  request: ActionArgs["request"],
  formData: FormData
) {
  const user = await requireUser(request);
  const form = formData.get("form");
  const token = formData.get("token");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");
  invariant(form === FORM.RESET_PASSWORD, "Invalid form");

  if (
    token &&
    typeof token === "string" &&
    newPassword &&
    typeof newPassword === "string" &&
    confirmPassword &&
    typeof confirmPassword === "string" &&
    newPassword === confirmPassword
  ) {
    const passwordError = getUserPasswordError(newPassword);
    if (passwordError) {
      return json(
        {
          form,
          errors: {
            token: null,
            newPassword: passwordError,
            confirmPassword: null,
          },
          success: false,
        },
        { status: 400 }
      );
    }

    const updatedUser = await resetPasswordByToken(user, token, newPassword);
    if (!updatedUser) {
      return json(
        {
          form,
          errors: {
            token: "Invalid token",
            newPassword: null,
            confirmPassword: null,
          },
          success: false,
        },
        { status: 400 }
      );
    }
    return json({
      form,
      errors: {
        token: null,
        newPassword: null,
        confirmPassword: null,
      },
      success: true,
    });
  } else if (
    newPassword &&
    confirmPassword &&
    newPassword !== confirmPassword
  ) {
    return json(
      {
        form,
        errors: {
          token: null,
          newPassword: "Passwords do not match",
          confirmPassword: "Passwords do not match",
        },
        success: false,
      },
      { status: 400 }
    );
  } else {
    return json(
      {
        form,
        errors: {
          token:
            !token || typeof token !== "string" ? "Token is required" : null,
          newPassword:
            !newPassword || typeof newPassword !== "string"
              ? "Password is required"
              : null,
          confirmPassword:
            !confirmPassword || typeof confirmPassword !== "string"
              ? "Confirm password is required"
              : null,
        },
        success: false,
      },
      { status: 400 }
    );
  }
}

export function SetNewPassword() {
  const response = useActionData<
    typeof resetPasswordAction | typeof validateTokenAction
  >();

  let token;
  let errors;
  if (response?.form === FORM.VALIDATE_RESET_TOKEN) {
    token = response.token || "";
    errors = {};
  } else {
    errors = response?.errors;
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5">Reset Password</Typography>
        <Typography variant="body2">
          Enter your new password. You will be asked to sign in after this
          process to ensure your account is secure.
        </Typography>
      </Box>

      <Form method="post">
        <input type="hidden" name="form" value={FORM.RESET_PASSWORD} />
        <input type="hidden" name="token" value={token} />
        <Stack spacing={2}>
          <PasswordInput
            showStrength
            label="New Password"
            name="newPassword"
            error={errors?.newPassword}
            autoComplete="new-password"
            required
          />
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            error={errors?.confirmPassword}
            required
          />
          <Box>
            <Button type="submit" variant="contained">
              Reset Password
            </Button>
          </Box>
        </Stack>
      </Form>
    </Stack>
  );
}
