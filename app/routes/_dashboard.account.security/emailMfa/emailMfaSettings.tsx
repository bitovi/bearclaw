import { Form, useLoaderData } from "@remix-run/react";
import { FORM, type loader } from "../route";
import { MFA_TYPE } from "~/models/mfa";
import Typography from "@mui/material/Typography";
import { VerifyEmailMfa } from "./enableEmailMfa";
import { Button } from "~/components/button";
import DisableEmailMfa from "./disableEmailMfa";
import { Stack } from "@mui/material";

export function EmailMfaSettings() {
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
    <Stack spacing={2}>
      <Typography variant="h5">Multi-factor authentication</Typography>
      <Typography variant="body2">
        Email MFA: {mfaEmailStatus.toUpperCase()}
      </Typography>
      <VerifyEmailMfa mfaEmailStatus={mfaEmailStatus} />
      {mfaEmail?.active ? (
        <DisableEmailMfa />
      ) : (
        <Form method="post">
          <input type="hidden" name="form" value={FORM.EMAIL_MFA_ENABLE} />
          <Button type="submit" variant="contained">
            Enable Email MFA
          </Button>
        </Form>
      )}
    </Stack>
  );
}
