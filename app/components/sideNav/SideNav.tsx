import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarIcon from "@mui/icons-material/Star";

import { Link } from "~/components/link";
import { useLocation } from "@remix-run/react";
import { Divider } from "@mui/material";
import React from "react";
import { IconFromString } from "../iconFromString/IconFromString";

export type NavItem = {
  text: string;
  to: string;
  icon?: string | JSX.Element;
  requiredPermissions?: string[];
};

type Props = {
  navMenu: NavItem[];
  iconColor?: string;
  dividerAfter?: number;
  userPermissions?: string[];
};

export function SideNav({ navMenu, dividerAfter, userPermissions = [] }: Props) {
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
        {navMenu.filter((item) => item.requiredPermissions 
          ? item.requiredPermissions.every((permission) => userPermissions.includes(permission))
          : true
        ).map((item, index) => {
          return (
            <React.Fragment key={index}>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={bestRouteMatch === item.to}
              >
                <ListItemIcon>
                  {item.icon && typeof item.icon === "string" 
                    ? <IconFromString icon={item.icon || ""} fallback={<StarIcon />} />
                    : item.icon 
                  }
                </ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
              </ListItemButton>
              {dividerAfter && dividerAfter === index && (
                <Divider component="li" sx={{ marginY: 2 }} />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </nav>
  );
}
