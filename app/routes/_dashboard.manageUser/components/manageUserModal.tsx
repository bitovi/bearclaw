import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Form, useNavigation } from "@remix-run/react";
import { TextInput } from "~/components/input";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import PersonRemoveTwoToneIcon from "@mui/icons-material/PersonRemoveTwoTone";
import { useState } from "react";
import { Button } from "~/components/button";
import { usePageCopy } from "~/routes/_dashboard/copy";

export const ManageUserModal = ({
  onClose: _onClose,
  formMethod,
  selectedUsers,
}: {
  formMethod: "post" | "delete" | undefined;
  onClose: () => void;
  selectedUsers: string[];
}) => {
  const copy = usePageCopy("userManagement");

  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState<string>();

  const onClose = () => {
    setInputValue("");
    _onClose();
  };

  const submitButtonDisabled =
    formMethod === "post"
      ? navigation.state === "loading" || navigation.state === "submitting"
      : navigation.state === "loading" ||
        navigation.state === "submitting" ||
        inputValue !== "REMOVE";

  return (
    <Dialog
      maxWidth="xs"
      open={!!formMethod}
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
      {!formMethod ? null : (
        <Form method={formMethod} action="/manageUser">
          <input
            hidden
            name="userIds"
            readOnly
            value={JSON.stringify(selectedUsers)}
          />
          <Stack
            boxShadow={2}
            borderRadius={"4px"}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            padding={3}
            gap={3}
          >
            <Stack alignItems="center" textAlign={"center"} gap={1}>
              {formMethod === "post" ? (
                <PersonAddTwoToneIcon fontSize="large" color="primary" />
              ) : (
                <PersonRemoveTwoToneIcon fontSize="large" color="primary" />
              )}
              <Typography variant="h5">
                {formMethod === "post" ? "Add New User" : "Remove User"}
              </Typography>
              <Typography variant="body1" paddingTop={1}>
                {formMethod === "post"
                  ? copy?.content?.confirmAddUser ||
                    "Please provide the email address of the user you would like to invite to your organization."
                  : copy?.content?.confirmRemoveUser ||
                    "Confirm removal of selected user(s) by typing 'REMOVE'. This can't be undone, and re-adding requires a new invite."}
              </Typography>
            </Stack>

            <Stack width="100%">
              <TextInput
                value={inputValue}
                onChange={({ target }) => setInputValue(target.value)}
                name="inviteEmail"
                id="inviteEmail"
                required
                autoFocus={true}
                type={formMethod === "post" ? "email" : "text"}
                autoComplete="email"
                placeholder={
                  formMethod === "post" ? "example@mail.com" : "REMOVE"
                }
              />
            </Stack>
            <Stack
              width="100%"
              direction="row"
              flex={1}
              justifyContent="flex-end"
              sx={{ color: "primary.main" }}
            >
              <Button
                variant="buttonMedium"
                type="reset"
                onClick={onClose}
                name="cancel"
              >
                {copy?.content?.cancelCTA || "Cancel"}
              </Button>
              <Button
                variant="buttonMedium"
                type="submit"
                name="submit"
                disabled={submitButtonDisabled}
              >
                {formMethod === "post"
                  ? copy?.content?.sendInviteCTA || "Send Invite"
                  : copy?.content?.removeCTA || "Remove"}
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Dialog>
  );
};
