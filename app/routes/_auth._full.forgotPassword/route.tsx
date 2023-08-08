import { useEffect, useRef } from "react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import Box from "@mui/material/Box";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { getUserId } from "~/session.server";
import { validateEmail } from "~/utils";
import { forgotPassword } from "~/models/user.server";
import { TextInput } from "~/components/input";
import { useParentFormCopy } from "../_auth/copy";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";
import { ButtonLoader } from "~/components/buttonLoader";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!validateEmail(email)) {
    return json(
      {
        errors: { email: "Email is invalid" },
        success: false,
        email: null,
      },
      { status: 400 }
    );
  }
  // if email is valid, send email with reset link
  // if email is invalid, do nothing. This is to prevent email enumeration
  await forgotPassword(email);
  return redirect(`/resetPassword?email=${email}`);
}

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function ForgotPage() {
  const navigation = useNavigation();
  const formCopy = useParentFormCopy();
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Stack
      alignItems="center"
      textAlign="center"
      gap="2rem"
      width={{ xs: "300px", md: "500px", lg: "700px" }}
    >
      <Stack gap={2}>
        <Typography variant="h5" color="#FFF">
          {formCopy?.forgotYourPassword || "Forgot your password?"}
        </Typography>
        <Typography variant="body2" color="#FFF">
          {formCopy?.forgotPasswordSubHeader ||
            "Please enter the email address associated with your account, and we'll email you a link to reset your password."}
        </Typography>
      </Stack>

      <Box
        component={Form}
        method="post"
        display="flex"
        flexDirection="column"
        gap="2rem"
        width="100%"
      >
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
            inputRef={emailRef}
            placeholder={formCopy?.email || "Email"}
            id="email"
            required
            autoFocus={true}
            name="email"
            type="email"
            autoComplete="email"
            error={actionData?.errors?.email}
            inputProps={{
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
                "&:hover": { backgroundColor: "#FFF" },
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
