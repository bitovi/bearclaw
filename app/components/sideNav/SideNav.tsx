import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarIcon from "@mui/icons-material/Star";

import { Link } from "~/components/link";
import { useLocation } from "@remix-run/react";

type NavItem = {
  label: string;
  to: string;
  icon?: React.ReactNode;
};

type Props = {
  navMenu: NavItem[];
  iconColor?: string;
};

export function SideNav({ navMenu }: Props) {
  const location = useLocation();
  const currentPath = location?.pathname;

  let bestRouteMatch = "";
  navMenu.forEach((item) => {
    if (
      item.to.length > bestRouteMatch.length &&
      currentPath?.includes(item.to)
    ) {
      bestRouteMatch = item.to;
    }
  });

  return (
    <nav>
      <List>
        {navMenu.map((item, index) => (
          <ListItemButton
            key={index}
            component={Link}
            to={item.to}
            selected={bestRouteMatch === item.to}
          >
            <ListItemIcon>{item.icon ? item.icon : <StarIcon />}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </ListItemButton>
        ))}
      </List>
    </nav>
  );
}
