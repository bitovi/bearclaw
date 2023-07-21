import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { NavLinks } from "./NavLinks";
import { Logo } from "~/components/logo/Logo";

export function NavDrawer({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <Box component="nav">
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        <Box
          padding="1.75rem 0"
          maxHeight="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="1rem"
          sx={{ overflowY: "auto" }}
        >
          <Logo variant="stacked" width="62px" />
          <NavLinks />
        </Box>
      </Drawer>
    </Box>
  );
}
