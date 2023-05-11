import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarIcon from "@mui/icons-material/Star";

import { Link } from "~/components/link";
import { useLocation } from "@remix-run/react";

export function SubscriptionSideNav() {
  const location = useLocation();

  return (
    <Box>
      <nav>
        <List>
          <ListItem sx={{ padding: 0 }}>
            <ListItemButton
              selected={location.pathname === "/subscription/overview"}
              component={Link}
              to="/subscription/overview"
            >
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText>Account</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ padding: 0 }}>
            <ListItemButton
              selected={location.pathname === "/subscription/manage"}
              component={Link}
              to="/subscription/manage"
            >
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText>Susbcription</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
