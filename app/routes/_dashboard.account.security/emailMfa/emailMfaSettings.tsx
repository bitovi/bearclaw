import { Form, useLoaderData } from "@remix-run/react";
import type { loader } from "../route";
import { MFA_TYPE } from "~/models/mfa";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { VerifyEmailMfa } from "./enableEmailMfa";
import { Button } from "~/components/button";
import DisableEmailMfa from "./disableEmailMfa";

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
    <Box>
      <Typography variant="h5">Two-factor authentication</Typography>
      <Typography>Email 2FA: {mfaEmailStatus.toUpperCase()}</Typography>

      <VerifyEmailMfa mfaEmailStatus={mfaEmailStatus} />
      {mfaEmail?.active ? (
        <DisableEmailMfa />
      ) : (
        <Form method="post">
          <input type="hidden" name="form" value="emailMfaEnable" />
          <Button type="submit" variant="outlined">Enable Email MFA</Button>
        </Form>
      )}
    </Box>
  );
}