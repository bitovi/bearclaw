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
import Box from "@mui/material/Box";

import { Button } from "~/components/button/Button";
import {
  PasswordStrengthMeter,
  getPasswordStrength,
} from "~/components/passwordStrengthMeter/PasswordStrengthMeter";
import { resetPasswordByToken } from "~/models/user.server";
import { TextInput } from "~/components/input";

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
      <Box padding={4}>
        <p className="text-center text-lg">
          Your password has been reset. You can now{" "}
          <Link to="/login">login</Link>.
        </p>
      </Box>
    );
  }

  return (
    <Box>
      <Form method="post" className="space-y-6">
        <Box display="flex" flexDirection="column" gap={2}>
          <TextInput
            label="Create new password"
            inputRef={passwordRef}
            onChange={(value) => {
              setPasswordStrength(getPasswordStrength(value.target.value));
            }}
            name="password"
            type="password"
            autoComplete="new-password"
            error={!!actionData?.errors?.password}
          />
          <PasswordStrengthMeter strength={passwordStrength} />
          <input type="hidden" name="token" value={token} />
          <Button type="submit" variant="contained">
            Reset password
          </Button>
          <div>
            Don't have an account?{" "}
            <Link
              to={{
                pathname: "/join",
                search: searchParams.toString(),
              }}
            >
              Sign up
            </Link>
          </div>
          <div>
            Know your password?{" "}
            <Link
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Login
            </Link>
          </div>
        </Box>
      </Form>
    </Box>
  );
}
