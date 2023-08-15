import Stack from "@mui/material/Stack";
import { json } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { getUserMfaMethods } from "~/models/mfa.server";
import { requireUser } from "~/session.server";
import {
  enableEmailMfaAction,
  verifyEmailMfaAction,
} from "./emailMfa/enableEmailMfa";
import { disableEmailMfaAction } from "./emailMfa/disableEmailMfa";
import { EmailMfaSettings } from "./emailMfa/emailMfaSettings";
import {
  ResetPassword,
  resetPasswordTokenAction,
} from "./resetPassword/resetPassword";
import { validateTokenAction } from "./resetPassword/validateToken";
import { resetPasswordAction } from "./resetPassword/setNewPassword";
// import emailImage from "./email.png";
import { LockImage } from "./lock.svg";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  const mfaMethods = await getUserMfaMethods(user);

  return json({ mfaMethods });
}

export const FORM = {
  EMAIL_MFA_ENABLE: "emailMfaEnable",
  EMAIL_MFA_VERIFY: "emailMfaVerify",
  EMAIL_MFA_DISABLE: "emailMfaDisable",
  CREATE_RESET_TOKEN: "createResetToken",
  VALIDATE_RESET_TOKEN: "validateResetToken",
  RESET_PASSWORD: "resetPassword",
  CANCEL: "cancel",
} as const;

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const form = formData.get("form");
  const token = formData.get("token");
  console.log("form", form);

  switch (form) {
    case FORM.EMAIL_MFA_ENABLE:
      return await enableEmailMfaAction(request);
    case FORM.EMAIL_MFA_VERIFY:
      return await verifyEmailMfaAction(user, token);
    case FORM.EMAIL_MFA_DISABLE:
      return await disableEmailMfaAction(request);
    case FORM.CREATE_RESET_TOKEN:
      return await resetPasswordTokenAction(request);
    case FORM.VALIDATE_RESET_TOKEN:
      return await validateTokenAction(request, formData);
    case FORM.RESET_PASSWORD:
      return await resetPasswordAction(request, formData);
    case FORM.CANCEL:
      return json({ form: null, success: true });
  }

  return json({ form, success: false });
}

export default function Security() {
  return (
    <Stack spacing={8} alignItems="center" textAlign="center" maxWidth={540}>
      {/* <img src={emailImage} alt="email" width={174} /> */}
      <LockImage />
      <ResetPassword />
      <EmailMfaSettings />
    </Stack>
  );
}
