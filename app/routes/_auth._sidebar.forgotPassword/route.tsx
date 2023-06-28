import { useEffect, useRef } from "react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import Box from "@mui/material/Box";

import { getUserId } from "~/session.server";
import { validateEmail } from "~/utils";
import { Button } from "~/components/button/Button";
import { forgotPassword } from "~/models/user.server";
import { TextInput } from "~/components/input";
import { useParentFormCopy } from "../_auth/copy";

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
      { errors: { email: "Email is invalid" }, success: false },
      { status: 400 }
    );
  }

  // if email is valid, send email with reset link
  // if email is invalid, do nothing. This is to prevent email enumeration
  await forgotPassword(email);

  return json({ errors: { email: null }, success: true });
}

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function ForgotPage() {
  const formCopy = useParentFormCopy();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
  }, [actionData]);

  if (actionData?.success) {
    return (
      <Box padding={4}>
        <p>
          If an account with that email exists, we've sent you an email with a
          link to reset your password.
        </p>
        <p>
          TESTING: Email messaging is not connected yet.{" "}
          <Link to="/fakeMail">View emails here</Link>
        </p>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Form method="post" className="space-y-6">
        <Box display="flex" flexDirection="column" gap={2}>
          <TextInput
            label={formCopy?.email || "Email address"}
            inputRef={emailRef}
            id="email"
            required
            autoFocus={true}
            name="email"
            type="email"
            autoComplete="email"
            error={actionData?.errors?.email}
          />
          <Button type="submit" variant="contained">
            {formCopy?.sendPasswordReset || "Send password reset email"}
          </Button>
          <div>
            {formCopy?.noAccountMessage || "Don't have an account?"}{" "}
            <Link
              to={{
                pathname: "/join",
                search: searchParams.toString(),
              }}
            >
              {formCopy?.noAccountLoginLink || "Sign up"}
            </Link>
          </div>
          <div>
            {formCopy?.alreadyKnowPasswordMessage || "Know your password? "}{" "}
            <Link
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              {formCopy?.alreadyKnowPasswordLink || "Login"}
            </Link>
          </div>
        </Box>
      </Form>
    </Box>
  );
}
