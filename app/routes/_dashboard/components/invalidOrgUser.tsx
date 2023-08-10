import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";

export function InvalidOrgUser() {
  return (
    <Dialog
      maxWidth="xs"
      aria-labelledby="org-user-removed"
      aria-describedby="User no longer a member of selected organization, click to log back in."
      open={true}
      sx={{
        "& form": {
          margin: 0,
        },
      }}
      // https://github.com/mui/material-ui/issues/33004#issuecomment-1473299089
      // When opened dialog won't auto focus TextInput given we don't need to restore focus to the + New button when modal closes, should be safe to disable this
      disableRestoreFocus
    >
      <Box padding={4} paddingBottom={2} textAlign={"center"}>
        <Typography variant="h6">
          User is no longer a member of this organization. Please log back in.
        </Typography>
        <ButtonLink to="/logout" sx={{ padding: 2, textAlign: "center" }}>
          Login
        </ButtonLink>
      </Box>
    </Dialog>
  );
}
