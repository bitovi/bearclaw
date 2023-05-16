import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import PersonIcon from "@mui/icons-material/Person";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";

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
              <ListItemIcon color="action.active">
                <PersonIcon color="inherit" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body1" color="text.primary">
                  Account
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ padding: 0 }}>
            <ListItemButton
              selected={location.pathname === "/subscription/manage"}
              component={Link}
              to="/subscription/manage"
            >
              <ListItemIcon color="action.active">
                <StarsRoundedIcon color="inherit" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body1" color="text.primary">
                  Subscription
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
