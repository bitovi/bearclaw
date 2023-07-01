import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import { Button } from "~/components/button/Button";
import {
  createOrganization,
  getOrganizationById,
} from "~/models/organization.server";
import { TextInput } from "~/components/input";
import { Link } from "~/components/link/Link";
import { getUserMfaMethods, resetMfaToken } from "~/models/mfa.server";
import { MFA_TYPE } from "~/models/mfa";
import { retrieveOrgUserOwner } from "~/models/organizationUsers.server";
import { useParentFormCopy } from "../_auth/copy";
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
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      {
        errors: {
          email: "Email is invalid",
          password: null,
          organization: null,
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
          organization: null,
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
          organization: null,
        },
      },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      {
        errors: {
          email: "Invalid email or password",
          password: null,
          organization: null,
        },
      },
      { status: 400 }
    );
  }

  const ownerOrgUser = await retrieveOrgUserOwner({ userId: user.id });
  let org;

  if (ownerOrgUser) {
    org = await getOrganizationById(ownerOrgUser.organizationId);
  }

  if (!ownerOrgUser) {
    const orgName = user.email.split("@")[0];
    const { organization: newOrg } = await createOrganization({
      userId: user.id,
      email: user.email,
      name: `${orgName}'s Organization`,
    });
    org = newOrg;
  }

  if (!org) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          organization:
            "Something went wrong verifying an organization for this user",
        },
      },
      { status: 400 }
    );
  }

  const mfaMethods = await getUserMfaMethods(user);

  if (mfaMethods.length > 0) {
    if (mfaMethods.find((m) => m.type === MFA_TYPE.SMS)) {
      // TODO
    }
    if (mfaMethods.find((m) => m.type === MFA_TYPE.EMAIL)) {
      resetMfaToken({ type: MFA_TYPE.EMAIL, user: user });
    }
  }

  return createUserSession({
    request,
    userId: user.id,
    orgId: org.id,
    mfaEnabled: mfaMethods.length > 0,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
}

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const formCopy = useParentFormCopy();
  const [searchParams] = useSearchParams();

  const redirectTo = safeRedirect(searchParams.get("redirectTo"), "/dashboard");
  const guestEmail = searchParams.get("email");

  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
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
      <AuthLogoHeader message={"Sign into your account"} />

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
            type="email"
            autoComplete="email"
            autoFocus={true}
            error={actionData?.errors?.email}
            inputRef={emailRef}
            defaultValue={guestEmail || ""}
            inputProps={{ readOnly: !!guestEmail }}
          />
          <TextInput
            fullWidth
            label={formCopy?.password || "Passowrd"}
            name="password"
            type="password"
            autoComplete="password"
            error={actionData?.errors?.password}
            inputRef={passwordRef}
          />

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <Typography
            alignSelf="flex-end"
            variant="body2"
            color="primary.main"
            component={Link}
            to={{
              pathname: "/forgotPassword",
              search: searchParams.toString(),
            }}
          >
            {formCopy?.forgotPasswordLink || "Forgot password?"}
          </Typography>

          <Box width="66%" alignSelf="center">
            <Button fullWidth type="submit" variant="buttonLarge">
              {formCopy?.login || "Login"}
            </Button>
            <Typography variant="body1" color="text.secondary" paddingY={2}>
              or
            </Typography>
            <Button fullWidth variant="buttonLargeOutlined" disabled>
              <Typography color="text.primary">Login with Github</Typography>
            </Button>
            <Box paddingTop={2}>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                New user?{" "}
              </Typography>

              <Typography
                component={Link}
                variant="body2"
                color="primary.main"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                {"Create an account"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
