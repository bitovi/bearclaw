import { Link } from "@remix-run/react";
import Box from "@mui/material/Box";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();

  return (
    <Box display="flex" gap={2}>
      {user ? (
        <Link to="/logout">Logout</Link>
      ) : (
        <>
          <Link to="/join">Sign up</Link>
          <Link to="/login">Log In</Link>
        </>
      )}
    </Box>
  );
}
