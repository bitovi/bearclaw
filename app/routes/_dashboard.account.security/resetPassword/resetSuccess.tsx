import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Form } from "@remix-run/react";
import { Button } from "~/components/button";
import { FORM } from "../route";

export function ResetSuccess() {
  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5">Reset Password</Typography>
        <Typography variant="body2">
          Your password has been successfully reset.
        </Typography>
      </Box>
      <Form method="post">
        <input type="hidden" name="form" value={FORM.CREATE_RESET_TOKEN} />
        <Button type="submit" variant="contained">
          Reset Password
        </Button>
      </Form>
    </Stack>
  );
}
