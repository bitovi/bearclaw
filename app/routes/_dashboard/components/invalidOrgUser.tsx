import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function InvalidOrgUser() {
  return (
    <Box textAlign={"center"}>
      <Typography variant="h4">
        User is no longer a member of this organization. Please select an
        organization of which the user is a member.
      </Typography>
    </Box>
  );
}
