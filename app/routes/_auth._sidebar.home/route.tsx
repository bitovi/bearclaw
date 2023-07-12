import { Link } from "@remix-run/react";
import Box from "@mui/material/Box";
import { useOptionalUser } from "~/utils";
import { json } from "@remix-run/node";

export async function loader() {
  console.log("LOG LOG LOG LOG ------- _auth._sidebar.home loader");

  return json({});
}

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
