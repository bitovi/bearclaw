import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import { Button } from "~/components/button/Button";
import {
  getPasswordStrength,
  PasswordStrengthMeter,
} from "~/components/passwordStrengthMeter/PasswordStrengthMeter";
import { TextInput } from "~/components/input";
import { useParentFormCopy } from "../_auth/copy";
import { PortableText } from "@portabletext/react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { AuthLogoHeader } from "~/components/authLogoHeader/AuthLogoHeader";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");

  if (!validateEmail(email)) {
    return json(
      {
        errors: {
          email: "Email is invalid",
          password: null,
          orgCreation: null,
        },
      },
      { status: 400 }
    );
  }

  // Only allow emails from certain domains
  // TODO: Remove this in production
  if (!email.match(/@(bigbear.ai|verybigthings.com|bitovi.com)$/)) {
    return json(
      {
        errors: {
          email: "Email is not in approved list",
          password: null,
          orgCreation: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: "Password is required",
          orgCreation: null,
        },
      },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: {
          email: null,
          password: "Password is too short",
          orgCreation: null,
        },
      },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
          orgCreation: null,
        },
      },
      { status: 400 }
    );
  }

  const { user, orgId, error } = await createUser(email, password, redirectTo);

  if (error || !orgId) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          orgCreation:
            typeof error === "string"
              ? error
              : "An error occured creating new organization",
        },
      },
      { status: 405 }
    );
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
      maxWidth="436px"
    >
      <AuthLogoHeader message={formCopy?.joinMessage} />
      {actionData?.errors.orgCreation && (
        <div>{actionData?.errors.orgCreation}</div>
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
              autoComplete="new-password"
              error={actionData?.errors?.password}
            />
            <Box padding="0.25rem 0.75rem">
              <PasswordStrengthMeter strength={passwordStrength} />
            </Box>
            <Box textAlign="left" padding="0 0.75rem">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={
                  formCopy?.joinAcceptTermsLabel ? (
                    <PortableText value={formCopy?.joinAcceptTermsLabel} />
                  ) : (
                    "I accept the terms and conditions"
                  )
                }
              />
            </Box>
          </Box>
          <input type="hidden" name="redirectTo" value={redirectTo} />
        </Box>
        <Box display="flex" justifyContent="center">
          <Box
            display="flex"
            flexDirection="column"
            gap="2rem"
            maxWidth="288px"
          >
            <Button fullWidth type="submit" variant="contained">
              {formCopy?.createAccount || "Create Account"}
            </Button>
            <div>
              {formCopy?.existingAccountMessage || "Already have an account?"}{" "}
              <Link
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                {formCopy?.existingAccountLoginLink || "Log in"}
              </Link>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
