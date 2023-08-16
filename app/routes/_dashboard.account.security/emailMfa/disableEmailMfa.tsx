import { Form } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Button } from "~/components/button/Button";
import { requireUser } from "~/session.server";
import { updateUserMfaMethod } from "~/models/mfa.server";
import { MFA_TYPE } from "~/models/mfa";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

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

export default function DisableEmailMfa() {
  const [showDisableEmailMfa, setShowDisableEmailMfa] = useState(false);

  return (
    <Stack spacing={2}>
      {showDisableEmailMfa ? (
        <>
          <Typography variant="h6">Disable Email MFA</Typography>
          <Typography variant="body2">
            Are you sure you want to disable email MFA?
          </Typography>
          <Form method="post">
            <Box display="flex" gap="1rem" justifyContent="center">
              <input type="hidden" name="form" value="emailMfaDisable" />
              <Button
                type="button"
                onClick={() => setShowDisableEmailMfa(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="outlined">
                Disable
              </Button>
            </Box>
          </Form>
        </>
      ) : (
        <Box display="flex" gap="1rem" justifyContent="center">
          <Button type="button" onClick={() => setShowDisableEmailMfa(true)}>
            Disable Email MFA
          </Button>
        </Box>
      )}
    </Stack>
  );
}
