import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarIcon from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import { Link } from "~/components/link";
import { useLocation } from "@remix-run/react";
import Divider from "@mui/material/Divider";
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
  dividerAfter?: number;
  userPermissions?: string[];
};

export function SideNav({
  navMenu,
  dividerAfter,
  userPermissions = [],
}: Props) {
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
        {navMenu
          .filter((item) =>
            item.requiredPermissions
              ? item.requiredPermissions.every((permission) =>
                  userPermissions.includes(permission)
                )
              : true
          )
          .map((item, index) => {
            return (
              <React.Fragment key={index}>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  selected={bestRouteMatch === item.to}
                  sx={{ borderRadius: "4px" }}
                >
                  <ListItemIcon
                    sx={{ color: "primary.main", minWidth: "32px" }}
                  >
                    {item.icon && typeof item.icon === "string" ? (
                      <IconFromString
                        icon={item.icon || ""}
                        fallback={<StarIcon />}
                      />
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    <Typography fontSize="0.875rem">{item.text}</Typography>
                  </ListItemText>
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
