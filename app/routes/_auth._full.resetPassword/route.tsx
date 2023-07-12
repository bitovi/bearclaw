import * as React from "react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import Box from "@mui/material/Box";
import { useParentFormCopy } from "../_auth/copy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { resetPasswordByToken } from "~/models/user.server";
import { TextInput } from "~/components/input";
import { Stack, Typography } from "@mui/material";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";
import { CodeValidationInput } from "~/components/codeValidationInput";
import { verifyPasswordCode } from "~/utils/verifyDigitCode.server";
import { ButtonLoader } from "~/components/buttonLoader";

export async function loader({ request }: LoaderArgs) {
  console.log("LOG LOG LOG LOG ------- _auth._full.resetPassword loader");

  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  return json({ email });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const email = formData.get("email")?.toString();

  if (!password) {
    return json(
      {
        errors: {
          password: "Password is invalid",
          email: null,
          token: null,
        },
        success: false,
      },
      { status: 400 }
    );
  }
  if (password !== confirmPassword) {
    return json(
      {
        errors: {
          password: "Passwords do not match",
          email: null,
          token: null,
        },
        success: false,
      },
      { status: 400 }
    );
  }

  if (!email) {
    return json(
      {
        errors: {
          email: "Email is required",
          password: null,
          token: null,
        },
        success: false,
      },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      {
        errors: {
          password: "Password is required",
          email: null,
          token: null,
        },
        success: false,
      },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: {
          password: "Password is too short",
          email: null,
          token: null,
        },
        success: false,
      },
      { status: 400 }
    );
  }

  const { isValid, error, code } = await verifyPasswordCode(formData);

  if (!isValid) {
    return json(
      {
        errors: { password: null, email: null, token: error },
        success: false,
      },
      { status: 400 }
    );
  }

  if (!code) {
    return json(
      {
        errors: { password: null, email: null, token: "Invalid code entry" },
        success: false,
      },
      { status: 400 }
    );
  }

  await resetPasswordByToken(code, password);

  return json({
    errors: { password: null, email: null, token: null },
    success: true,
  });
}

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function ResetPage() {
  const navigation = useNavigation();
  const formCopy = useParentFormCopy();
  const actionData = useActionData<typeof action>();
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const { email } = useLoaderData<typeof loader>();

  React.useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
  }, [actionData]);

  if (actionData?.success) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        gap="2rem"
        height="100%"
        width="100%"
      >
        <Box>
          <Typography sx={{ paddingBottom: 1 }} variant="h5" color="#FFF">
            {formCopy?.passwordReset || "Password Reset"}
          </Typography>
          <Typography variant="body2" color="#FFF">
            {formCopy?.passwordResetSuccessMessage ||
              "Your password has been successfully reset. Click below to sign in."}
          </Typography>
          <ButtonLink
            fullWidth
            variant="buttonLarge"
            to="/login"
            sx={{
              color: "#FFF",
              marginTop: 4,
              width: "66%",
            }}
          >
            {formCopy?.signin || "Sign In"}
          </ButtonLink>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" textAlign="center" gap="2rem">
      <Stack gap={2}>
        <Typography variant="h5" color="#FFF">
          {formCopy?.passwordRequestSent || "Request sent successfully"}
        </Typography>
        <Typography variant="body2" color="#FFF">
          {formCopy?.verifyEmailInstructionPart1 ||
            "We've emailed a 6-digit confirmation code to"}{" "}
          {email || "your provided email"},{" "}
          {formCopy?.verifyEmailInstructionPart2 ||
            "please enter the code below to verify your account."}
        </Typography>
      </Stack>

      <Box
        component={Form}
        method="put"
        display="flex"
        flexDirection="column"
        gap="2rem"
        width="100%"
      >
        {actionData?.errors.token && (
          <Box>
            <Typography variant="body1" color="error">
              {actionData.errors.token}
            </Typography>
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            "& label.Mui-focused": {
              color: "#FFF",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "#FFF",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#FFF",
              },
              "&:hover fieldset": {
                borderColor: "#FFF",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FFF",
              },
            },
          }}
        >
          <TextInput
            variant="outlined"
            label={formCopy?.email || "Email"}
            id="email"
            required
            inputRef={emailRef}
            name="email"
            type="email"
            autoComplete="email"
            error={actionData?.errors?.email}
            defaultValue={email || ""}
            InputLabelProps={{
              sx: {
                color: "#FFF",
              },
            }}
            inputProps={{
              readOnly: !!email,
              sx: {
                color: "#FFF",
              },
            }}
          />
          <CodeValidationInput
            autoFocus
            containerProps={{ marginLeft: { xs: "0.5rem", lg: "unset" } }}
          />
          <TextInput
            variant="outlined"
            placeholder={formCopy?.password || "Password"}
            id="password"
            required
            inputRef={passwordRef}
            name="password"
            type="password"
            error={actionData?.errors?.password}
            inputProps={{
              // TODO: Cypress simply could not find these password inputs
              "data-testid": "passwordInput",
              sx: {
                color: "#FFF",
              },
            }}
          />
          <TextInput
            variant="outlined"
            placeholder={formCopy?.confirmPassword || "Confirm Password"}
            id="confirmPassword"
            required
            name="confirmPassword"
            type="password"
            inputProps={{
              "data-testid": "confirmPasswordInput",
              sx: {
                color: "#FFF",
              },
            }}
          />
          <Box width="66%" alignSelf="center">
            <ButtonLoader
              fullWidth
              type="submit"
              variant="buttonLarge"
              sx={{ marginY: 4 }}
              loading={
                navigation.state === "loading" ||
                navigation.state === "submitting"
              }
            >
              {formCopy?.sendPasswordReset || "Send password reset email"}
            </ButtonLoader>
            <ButtonLink
              variant="buttonMedium"
              type="button"
              to="/login"
              sx={{
                "&:hover": { backgroundColor: "#0037FF" },
                color: "primary.main",
              }}
            >
              <KeyboardArrowLeftIcon />
              {formCopy?.returnToSignInCTA || "Return to Sign In"}
            </ButtonLink>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
