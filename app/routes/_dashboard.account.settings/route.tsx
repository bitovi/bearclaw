import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { json } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
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

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  const mfaMethods = await getUserMfaMethods(user);

  return json({ mfaMethods });
}

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const form = formData.get("form");

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
      <Typography variant="h3">MFA</Typography>
      <Typography>Email MFA: {mfaEmailStatus.toUpperCase()}</Typography>

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

export default function Settings() {
  return (
    <Box>
      <EmailMfaSettings />
    </Box>
  );
}
