import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import StarIcon from "@mui/icons-material/Star";

import { Link } from "~/components/link";

export function Sidenav() {
  return (
    <Box>
      <nav>
        <List>
          <ListItem>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to="/analysis">
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText>Analysis</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to="/supplyChain">
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText>Supply Chain</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav>
        <List>
          <ListItem>
            <ListItemButton component={Link} to="/subscription">
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText>Subscriptions</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to="/logout">
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
