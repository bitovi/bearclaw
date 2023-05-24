import { useOptionalUser } from "~/utils";
import Box from "@mui/material/Box";
import { url } from "gravatar";
import { Logo } from "./logo";

export const Header = () => {
  const user = useOptionalUser();

  return (
    <Box
      component="header"
      width="100%"
      padding="1rem 1.5rem"
      display="flex"
      justifyContent="space-between"
    >
      <Logo />
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        {user?.email && (
          <Box
            component="img"
            src={url(user?.email || "", { size: "32" }, true)}
            alt=""
            borderRadius="50%"
          />
        )}
        <div>
          {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
        </div>
      </Box>
    </Box>
  );
};
