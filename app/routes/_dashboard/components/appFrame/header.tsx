import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { GlobalSearch } from "./globalSearch";
import { Logo } from "~/components/logo/Logo";
import AccountMenu from "./accountMenu";

export const Header = ({
  onToggleMobileNav,
}: {
  onToggleMobileNav: () => void;
}) => {
  return (
    <AppBar position="static" component={"header"}>
      <Toolbar
        component={Stack}
        direction="row"
        sx={{
          padding: 0,
        }}
      >
        <Box flex="1" display={{ xs: "initial", md: "none" }}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={onToggleMobileNav}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box display={{ xs: "initial", md: "none" }}>
          <Logo variant="inline" width="124px" />
        </Box>
        <Box flex="1" display={{ xs: "none", md: "initial" }}>
          <GlobalSearch />
        </Box>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
};
