import { url } from "gravatar";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useOptionalUser } from "~/utils";
import { GlobalSearch } from "./GlobalSearch";
import { Logo } from "~/components/logo/Logo";

export const Header = ({
  onToggleMobileNav,
}: {
  onToggleMobileNav: () => void;
}) => {
  const user = useOptionalUser();

  return (
    <AppBar position="static" component={"header"}>
      <Toolbar
        component={Stack}
        direction="row"
        sx={{
          justifyContent: "space-between",
          paddingBottom: 0,
        }}
      >
        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="start"
          onClick={onToggleMobileNav}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box display={{ xs: "initial", md: "none" }}>
          <Logo variant="inline" width="124px" />
        </Box>
        <Box flex="1" display={{ xs: "none", md: "initial" }}>
          <GlobalSearch />
        </Box>
        {user?.email && (
          <Box
            display={{ xs: "none", md: "initial" }}
            component="img"
            src={url(user?.email || "", { size: "32" }, true)}
            alt=""
            borderRadius="50%"
          />
        )}
        <Typography
          color="text.primary"
          display={{ xs: "none", md: "initial" }}
        >
          {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
