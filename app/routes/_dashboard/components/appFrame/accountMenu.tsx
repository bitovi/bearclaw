import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useOptionalUser } from "~/utils";
import { url } from "gravatar";
import { Link, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { IconFromString } from "~/components/iconFromString/IconFromString";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useHeaderMenuCopy } from "../../copy";
import type { loader } from "../../route";
import type { CopyLink } from "../../types";
import { getUserFullName } from "~/utils/user/getUserFullName";

const defaultMenu: Array<Omit<CopyLink, "_key" | "_type">> = [
  {
    to: "/account/info",
    text: "My Account",
    icon: "person",
    requiredPermissions: [],
  },
  {
    to: "subscription/overview",
    text: "Subscription",
    icon: "workspace",
    requiredPermissions: [],
  },
  {
    to: "/logout",
    text: "Sign out",
    icon: "logout",
    requiredPermissions: [],
  },
];

export default function AccountMenu() {
  const user = useOptionalUser();
  const { permissions } = useLoaderData<typeof loader>();
  const copy = useHeaderMenuCopy();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const avatarImage = useMemo(
    () => url(user?.email || "", { size: "80" }, true),
    [user?.email]
  );

  const links = copy?.links && copy.links.length > 0 ? copy.links : defaultMenu;

  const userFullName = user && getUserFullName(user);

  return (
    <Box display="flex" gap={2} alignItems="center">
      <Avatar
        sx={{
          width: 32,
          height: 32,
          display: { xs: "none", md: "inline-block" },
        }}
        src={avatarImage}
      >
        {userFullName ? userFullName[0] : user?.email[0]}
      </Avatar>
      <Typography
        display={{ xs: "none", md: "inline-block" }}
        variant="body1"
        color="text.primary"
        textTransform="none"
      >
        {userFullName || user?.email || "Account"}
      </Typography>

      <Tooltip title="Account settings">
        <IconButton
          size="large"
          onClick={handleClick}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <ArrowDropDownIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            width: "280px",
            overflow: "visible",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          padding={2}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar sx={{ width: 40, height: 40, mb: 2 }} src={avatarImage}>
            {userFullName ? userFullName[0] : user?.email[0]}
          </Avatar>
          {userFullName ? (
            <Typography variant="body1">{userFullName}</Typography>
          ) : null}
          {user?.email ? (
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          ) : null}
        </Box>
        <Box component={Divider} marginY={1} />
        {links
          .filter((item) =>
            item.requiredPermissions
              ? item.requiredPermissions.every((permission) =>
                  permissions.includes(permission)
                )
              : true
          )
          .map((item, index) => {
            return (
              <React.Fragment key={index}>
                <MenuItem component={Link} to={item.to} onClick={handleClose}>
                  <ListItemIcon>
                    <IconFromString icon={item.icon || ""} />
                  </ListItemIcon>
                  {item.text}
                </MenuItem>
                {copy?.dividerAfter && copy.dividerAfter === index + 1 && (
                  <Divider component="li" sx={{ marginY: 2 }} />
                )}
              </React.Fragment>
            );
          })}
      </Menu>
    </Box>
  );
}
