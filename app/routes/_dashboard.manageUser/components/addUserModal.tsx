import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Form } from "@remix-run/react";
import { TextInput } from "~/components/input";

//TODO Validate email before sending invite /utils
export const AddUserModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& form": {
          margin: 0,
        },
      }}
      // https://github.com/mui/material-ui/issues/33004#issuecomment-1473299089
      // When opened dialog won't auto focus TextInput given we don't need to restore focus to the + New button when modal closes, should be safe to disable this
      disableRestoreFocus
    >
      <Form method="post" action="/manageUser">
        <Stack
          minHeight={400}
          minWidth={600}
          boxShadow={2}
          borderRadius={"4px"}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          padding={2}
          gap={3}
        >
          <Typography variant="h1">Add User</Typography>
          <Typography variant="body1" paddingTop={1}>
            Please provide the email address of the user you would like to
            invite to your organization.
          </Typography>
          <Stack width="100%" paddingTop={2}>
            <TextInput
              name="inviteEmail"
              label="Email"
              id="inviteEmail"
              required
              autoFocus={true}
              type="email"
              autoComplete="email"
            />
          </Stack>
          <Stack
            width="100%"
            flex={1}
            justifyContent="flex-end"
            paddingBottom={3}
          >
            <Button variant="contained" type="submit" fullWidth name="submit">
              Send Invite
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Dialog>
  );
};
