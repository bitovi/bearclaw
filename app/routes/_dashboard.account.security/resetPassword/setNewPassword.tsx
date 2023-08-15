import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { resetPasswordByToken } from "~/models/user.server";
import { validateVerificationToken } from "~/models/verificationToken.server";
import { requireUser } from "~/session.server";
import { FORM } from "../route";
import { Form, useActionData } from "@remix-run/react";
import { Button } from "~/components/button";
import { TextInput } from "~/components/input";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { validateTokenAction } from "./validateToken";

export async function resetPasswordAction(request: ActionArgs["request"]) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const form = formData.get("form");
  const token = formData.get("token");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  invariant(form === FORM.RESET_PASSWORD, "Invalid form");

  if (
    token && typeof token === "string" &&
    password && typeof password === "string" &&
    confirmPassword && typeof confirmPassword === "string" &&
    password !== confirmPassword
  ) {
    const validatedToken = await validateVerificationToken(user.id, token);
    if (!validatedToken) {
      return json(
        {
          form,
          errors: {
            token: "Invalid token",
            password: null,
            confirmPassword: null,
          },
          success: false,
        },
        { status: 400 }
      );
    }
    await resetPasswordByToken(user, token, password);
    return json({
      form,
      errors: {
        token: null,
        password: null,
        confirmPassword: null,
      },
      success: true
    });
  } else if (password && confirmPassword && password !== confirmPassword) {
    return json(
      {
        form,
        errors: {
          token: null,
          password: "Passwords do not match",
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
          token: !token && typeof token !== "string" ? "Token is required" : null,
          password: !password && typeof password !== "string" ? "Password is required" : null,
          confirmPassword: !confirmPassword && typeof confirmPassword !== "string" ? "Confirm password is required" : null,
        },
        success: false,
      },
      { status: 400 }
    );
  }
}

export function ResetPassword() {
  const response = useActionData<typeof resetPasswordAction | typeof validateTokenAction>();

  let token;
  let errors;
  if (response?.form === FORM.VALIDATE_RESET_TOKEN) {
    token = response.token || ""
    errors = {};
  } else {
    token = response?.errors?.token || ""
    errors = response?.errors
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5">Reset your password</Typography>
        <Typography variant="body2">
          Enter your new password. You will be asked to sign in after this process to ensure your account is secure.
        </Typography>
      </Box>

      <Form method="post">
        <input type="hidden" name="form" value={FORM.RESET_PASSWORD} />
        <input type="hidden" name="token" value={token} />
        <Stack spacing={2}>
          <TextInput
            label="New Password"
            name="newPassword"
            type="password"
            error={errors?.password}
          />
          <TextInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            error={errors?.confirmPassword}
          />
          <Button type="submit">Reset Password</Button>
        </Stack>
      </Form>
    </Stack>
  );
}
