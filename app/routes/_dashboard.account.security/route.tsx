import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { json } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/button";
import { MFA_TYPE } from "~/models/mfa";
import { getUserMfaMethods } from "~/models/mfa.server";
import { requireUser } from "~/session.server";
import {
  VerifyEmailMfa,
  enableEmailMfaAction,
  verifyEmailMfaAction,
} from "./emailMfa/enableEmailMfa";
import DisableEmailMfa, {
  disableEmailMfaAction,
} from "./emailMfa/disableEmailMfa";
import emailImage from "./email.png";
import { Stack } from "@mui/material";
import { useState } from "react";
import { TextInput } from "~/components/input";
import {
  createVerificationToken,
  sendVerificationTokenEmail,
} from "~/models/verificationToken.server";
import { CodeValidationInput } from "~/components/codeValidationInput";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  const mfaMethods = await getUserMfaMethods(user);

  return json({ mfaMethods });
}

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const form = formData.get("form");

  if (form === "createResetToken") {
    return await resetPasswordTokenAction(request);
  }
  if (form === "resetPassword") {
    return { form: "createResetToken", success: true };
  }
  if (form === "emailMfaEnable") {
    return await enableEmailMfaAction(request);
  }
  if (form === "emailMfaVerify") {
    const token = formData.get("token");
    return await verifyEmailMfaAction(user, token);
  }
  if (form === "emailMfaDisable") {
    return await disableEmailMfaAction(request);
  }

  return json({ form, success: false });
}

function EmailMfaSettings() {
  const { mfaMethods } = useLoaderData<typeof loader>();

  const mfaEmail = mfaMethods.find((mfa) => {
    return mfa.type === MFA_TYPE.EMAIL;
  });

  const mfaEmailStatus =
    !mfaEmail || !mfaEmail.active
      ? "off"
      : mfaEmail.verifiedAt
      ? "active"
      : "not verified";

  return (
    <Box>
      <Typography variant="h5">Two-factor authentication</Typography>
      <Typography>Email 2FA: {mfaEmailStatus.toUpperCase()}</Typography>

      <VerifyEmailMfa mfaEmailStatus={mfaEmailStatus} />
      {mfaEmail?.active ? (
        <DisableEmailMfa />
      ) : (
        <Form method="post">
          <input type="hidden" name="form" value="emailMfaEnable" />
          <Button type="submit">Enable Email MFA</Button>
        </Form>
      )}
    </Box>
  );
}

async function resetPasswordTokenAction(request: ActionArgs["request"]) {
  console.log("resetPasswordTokenAction");
  const user = await requireUser(request);
  const { token } = await createVerificationToken(user.id);
  await sendVerificationTokenEmail(user.email, token);

  return json({ form: "createResetToken", success: true });
}

function ResetPassword() {
  const response = useActionData<typeof resetPasswordTokenAction>();
  const [showForm, setShowForm] = useState(false);

  if (response?.success && response.form === "createResetToken") {
    return (
      <Form>
        <Box>
          <Typography variant="h5">Reset your password</Typography>
          <Typography>
            We've emailed a 6-digit confirmation code to j.smith@email.com,
            please enter the code below to verify your account and continue.
          </Typography>
        </Box>
        <input type="hidden" name="form" value="validateToken" />
        <Stack spacing={2}>
          <CodeValidationInput />
          <Button onClick={() => setShowForm(true)} type="submit">
            Confirm
          </Button>
        </Stack>
      </Form>
    );
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5">Reset your password</Typography>
        <Typography>
          We'll email you a link to j.smith@email.com to reset your password.
          You will need to verify your account once more to complete this
          process.
        </Typography>
      </Box>

      {showForm ? (
        <Form>
          <input type="hidden" name="form" value="resetPassword" />
          <Stack spacing={2}>
            <TextInput
              label="New Password"
              name="newPassword"
              type="password"
            />
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
            />
            <Button type="submit">Reset Password</Button>
          </Stack>
        </Form>
      ) : (
        <Form>
          <input type="hidden" name="form" value="createResetToken" />
          <Button type="submit">Reset Password</Button>
        </Form>
      )}
    </Stack>
  );
}

export default function Security() {
  return (
    <Stack spacing={4}>
      <img src={emailImage} alt="email" width={174} />
      <ResetPassword />
      <EmailMfaSettings />
    </Stack>
  );
}
