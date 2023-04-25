import * as React from "react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";

import { Button } from "~/components/button/Button";
import {
  PasswordStrengthMeter,
  getPasswordStrength,
} from "~/components/passwordStrengthMeter/PasswordStrengthMeter";
import { resetPasswordByToken } from "~/models/user.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";

  return json({ token });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const token = formData.get("token")?.toString();

  if (!password) {
    return json(
      { errors: { password: "Password is invalid" }, success: false },
      { status: 400 }
    );
  }

  if (!token) {
    return json(
      { errors: { password: null, token: "Token is invalid" }, success: false },
      { status: 400 }
    );
  }

  await resetPasswordByToken(token, password);

  return json({ errors: { password: null }, success: true });
}

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function ResetPage() {
  const [searchParams] = useSearchParams();
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const actionData = useActionData<typeof action>();
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const { token } = useLoaderData<typeof loader>();

  React.useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  if (actionData?.success) {
    return (
      <div className="flex min-h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-md px-8">
          <p className="text-center text-lg">
            Your password has been reset. You can now{" "}
            <Link to="/login">login</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Create new password
            </label>
            <div className="my-1">
              <input
                id="password"
                ref={passwordRef}
                onChange={(value) => {
                  setPasswordStrength(getPasswordStrength(value.target.value));
                }}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password && (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </div>
            <PasswordStrengthMeter strength={passwordStrength} />
          </div>
          <input type="hidden" name="token" value={token} />
          <Button type="submit" className="w-full">
            Reset password
          </Button>
          <div className="flex flex-col items-center gap-2">
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
