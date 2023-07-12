import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { IconFromString } from "~/components/iconFromString/IconFromString";
import { useSideNavCopy } from "~/routes/_dashboard/copy";
import { toTitleCase } from "~/utils/string/toTitleCase";

export function Breadcrumbs() {
  const copy = useSideNavCopy();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {pathnames.map((path, index) => {
        const match = copy?.links.find(
          (link) =>
            link.to.replace("/", "").toLowerCase() === path.toLowerCase()
        );
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return last ? (
          <Box display="flex" gap="0.5rem" color="primary.main">
            <IconFromString icon={match?.icon || ""} />
            <Typography color="text.primary" key={to}>
              {match?.text || toTitleCase(path)}
            </Typography>
          </Box>
        ) : (
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={to}
            key={to}
          >
            <Box display="flex" gap="0.5rem" color="primary.main">
              <IconFromString icon={match?.icon || ""} />
              {match?.text || toTitleCase(path)}
            </Box>
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
