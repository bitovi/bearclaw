import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarIcon from "@mui/icons-material/Star";

import { Link } from "~/components/link";

type NavItem = {
  label: string;
  to: string;
  icon?: React.ReactNode;
};

type Props = {
  navMenu: NavItem[];
};

export function SideNav({ navMenu }: Props) {
  return (
    <nav>
      <List>
        {navMenu.map(({ label, to, icon }, index) => (
          <ListItem key={index}>
            <ListItemButton component={Link} to={to}>
              <ListItemIcon>{icon ? icon : <StarIcon />}</ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </nav>
  );
}
