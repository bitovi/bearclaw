import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { getUser, createUserSession } from "~/session.server";
import { createUser } from "~/models/user.server";
import { safeRedirect } from "~/utils";
import {
  getPasswordStrength,
  PasswordStrengthMeter,
} from "~/components/passwordStrengthMeter/PasswordStrengthMeter";
import { TextInput } from "~/components/input";
import { useParentFormCopy } from "../_auth/copy";
import { PortableText } from "@portabletext/react";
import { AuthLogoHeader } from "~/components/authLogoHeader/AuthLogoHeader";
import { ButtonLoader } from "~/components/buttonLoader";
import { FormControl, FormHelperText } from "@mui/material";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  if (!user) return json({});
  if (user && !user.emailVerifiedAt) {
    redirect("/verifyEmail");
    return json({});
  }
  return redirect("/dashboard");
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  console.log("acceptTerms", formData.get("acceptTerms"));
  const acceptTerms = Boolean(formData.get("acceptTerms"));
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");

  const { user, orgId, errors } = await createUser(
    email,
    password,
    acceptTerms,
    redirectTo
  );

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  return createUserSession({
    request,
    userId: user.id,
    orgId,
    mfaEnabled: false,
    remember: false,
    redirectTo,
  });
}

export const meta: V2_MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const formCopy = useParentFormCopy();

  const [searchParams] = useSearchParams();
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const guestEmail = searchParams.get("email");

  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      gap="2rem"
      width={{ xs: "300px", md: "500px", lg: "700px" }}
    >
      <AuthLogoHeader
        message={
          formCopy?.joinSubHeader ||
          "Getting started is absolutely free. Fill in the fields to create your account."
        }
      />
      {actionData?.errors.orgCreation && (
        <Typography>{actionData?.errors.orgCreation}</Typography>
      )}
      <Box
        component={Form}
        method="post"
        display="flex"
        flexDirection="column"
        gap="2rem"
        width="100%"
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <TextInput
            fullWidth
            label={formCopy?.email || "Email address"}
            name="email"
            id="email"
            required
            autoFocus={true}
            type="email"
            autoComplete="email"
            error={actionData?.errors?.email}
            defaultValue={guestEmail || ""}
            inputProps={{ readOnly: !!guestEmail }}
          />
          <Box>
            <TextInput
              fullWidth
              label={formCopy?.password || "Password"}
              id="password"
              inputRef={passwordRef}
              onChange={(value) => {
                setPasswordStrength(getPasswordStrength(value.target.value));
              }}
              onBlur={(value) => {
                setPasswordStrength(getPasswordStrength(value.target.value));
              }}
              name="password"
              type="password"
              required
              autoComplete="new-password"
              error={actionData?.errors?.password}
            />
            <Box padding="0.25rem 0.75rem">
              <PasswordStrengthMeter strength={passwordStrength} />
            </Box>
            <FormControl
              error={!!actionData?.errors?.acceptTerms}
              sx={{ alignItems: "center" }}
            >
              <FormControlLabel
                name="acceptTerms"
                control={<Checkbox />}
                label={
                  formCopy?.joinAcceptTermsLabel ? (
                    <PortableText value={formCopy?.joinAcceptTermsLabel} />
                  ) : (
                    "I accept the terms and conditions"
                  )
                }
              />
              <FormHelperText>{actionData?.errors?.acceptTerms}</FormHelperText>
            </FormControl>
          </Box>
          <input type="hidden" name="redirectTo" value={redirectTo} />
        </Box>
        <Box width="66%" alignSelf="center">
          <ButtonLoader
            fullWidth
            type="submit"
            variant="buttonLarge"
            loading={
              navigation.state === "submitting" ||
              navigation.state === "loading"
            }
          >
            {formCopy?.createAccountButton || "Sign Up"}
          </ButtonLoader>
        </Box>
      </Box>

      <Box>
        <Typography component="span" variant="body2" color="text.secondary">
          {formCopy?.existingAccountMessage || "Already have an account?"}{" "}
        </Typography>
        <Typography
          component={Link}
          to={{
            pathname: "/login",
            search: searchParams.toString(),
          }}
          sx={{
            textDecoration: "none",
          }}
          color="primary.main"
          variant="body2"
        >
          {formCopy?.existingAccountLoginLink || "Sign in here"}
        </Typography>
      </Box>
    </Box>
  );
}
