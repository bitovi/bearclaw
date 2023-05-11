import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import Box from "@mui/material/Box";

export const Header = () => {
  const user = useOptionalUser();

  return (
    <Box
      component="header"
      width="100%"
      borderBottom="1px solid grey"
      padding="1rem 1.5rem"
    >
      <Box display="flex" gap={1} justifyContent="flex-end">
        <div>
          {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
        </div>
        <Link to="/logout">Logout</Link>
      </Box>
    </Box>
  );
};
