import { Box } from "@mui/material";
import { json } from "@remix-run/node";
import { UserTable } from "./components/userTable";

export async function loader() {
  // confirm the user has appropriate privileges
  return json({});
}

export default function Route() {
  return (
    <Box>
      {/**
         UserTable will need:
          - Remove handler that reads from selected
          - Table data to display 
         */}
      <UserTable />
    </Box>
  );
}
