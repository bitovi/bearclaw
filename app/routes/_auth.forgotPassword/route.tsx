import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { getUserId } from "~/session.server";
import { validateEmail } from "~/utils";
import { Button } from "~/components/button/Button";
import { forgotPassword } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
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

  return json(
    { errors: { email: null }, success: true }
  );
}

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function ForgotPage() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
  }, [actionData]);

  if (actionData?.success) {
    return (
      <div className="flex min-h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-md px-8">
          <p className="text-lg text-center">
            If an account with that email exists, we've sent you an email with a link to reset your password.
          </p>
          <p className="text-lg text-gray-500 mt-4">
            TESTING: Email messaging is not connected yet. <Link to="/fakeMail">View emails here</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Send password reset email
          </Button>
          <div className="flex items-center flex-col gap-2">
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500">
              Know your password?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Login
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
