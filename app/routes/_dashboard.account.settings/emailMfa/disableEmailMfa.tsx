import { Form } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button } from "~/components/button/Button";
import { requireUser } from "~/session.server";
import { updateUserMfaMethod } from "~/models/mfa.server";
import { MFA_TYPE } from "~/models/mfa";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({ user });
}

export async function disableEmailMfaAction(request: ActionArgs["request"]) {
  const user = await requireUser(request);

  await updateUserMfaMethod({
    user,
    type: MFA_TYPE.EMAIL,
    active: false,
  });

  return json({ form: "emailMfaDisable", success: true });
}

export default function DisableEmailMfa(
) {
  const [showDisableEmailMfa, setShowDisableEmailMfa] = useState(false);

  return (
    <Box my={2}>
      {showDisableEmailMfa ? (
        <>
          <Typography fontWeight="700">Disable Email MFA</Typography>
          <Typography>
            Are you sure you want to disable email MFA?
          </Typography>
          <Form method="post">
            <input type="hidden" name="form" value="emailMfaDisable" />
            <Button type="submit" variant="outlined">Disable</Button>
            <Button type="button" onClick={() => setShowDisableEmailMfa(false)}>Cancel</Button>
          </Form>
        </>
      ) : (
        <Button type="button" onClick={() => setShowDisableEmailMfa(true)}>
          Disable Email MFA
        </Button>
      )}
    </Box>
  );
}