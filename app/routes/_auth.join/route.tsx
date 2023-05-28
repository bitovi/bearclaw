import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
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
import {
  returnInviteToken,
  validateInvitiationToken,
} from "~/models/invitationToken.server";
import { Typography } from "@mui/material";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo");

  if (redirectTo) {
    const inviteToken = returnInviteToken(redirectTo);
    if (inviteToken) {
      const invitationToken = await validateInvitiationToken(inviteToken);
      if (!invitationToken) {
        return json({
          error:
            "Unable to find invitation token or token has already expired. Please contact organization adminstrator to request a new invitation token.",
          email: null,
        });
      }
      return json({ email: invitationToken.guestEmail, error: null });
    }
  }
  return json({ email: null, error: null });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
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
  const [searchParams] = useSearchParams();
  const { email, error: loaderError } = useLoaderData<typeof loader>();

  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
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

  useEffect(() => {
    if (email && emailRef.current) {
      emailRef.current.value = email;
    }
  }, [email]);

  return (
    <>
      {loaderError && (
        <Box paddingBottom={4}>
          <Typography variant={"h6"} color="error">
            {loaderError}
          </Typography>
        </Box>
      )}
      <Box display="flex" flexDirection="column" justifyContent="center">
        {actionData?.errors.orgCreation && (
          <div>{actionData?.errors.orgCreation}</div>
        )}

        <Form method="post">
          <Box display="flex" flexDirection="column" gap={2}>
            <TextInput
              label="Email"
              name="email"
              inputRef={emailRef}
              id="email"
              required
              autoFocus={true}
              type="email"
              autoComplete="email"
              error={actionData?.errors?.email}
              inputProps={{ readOnly: !!email }}
            />
            <TextInput
              label="Password"
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
            <PasswordStrengthMeter strength={passwordStrength} />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Button type="submit" variant="contained">
              Create Account
            </Button>
            <div>
              Already have an account?{" "}
              <Link
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </Box>
        </Form>
      </Box>
    </>
  );
}
