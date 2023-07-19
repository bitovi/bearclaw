import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { IconFromString } from "~/components/iconFromString/IconFromString";
import { usePageCopy, useSideNavCopy } from "~/routes/_dashboard/copy";
import { toTitleCase } from "~/utils/string/toTitleCase";

function findTopNavMatch(
  sideNavCopy: ReturnType<typeof useSideNavCopy>,
  path: string
) {
  return sideNavCopy?.links.find(
    (link) => link.to.match(/\w+/)?.[0]?.toLowerCase() === path.toLowerCase()
  );
}

function findSubNavMatch(
  pageCopy: ReturnType<typeof usePageCopy>,
  path: string
) {
  return pageCopy?.subNavLinks?.find(
    (link) => link.to.split("/").pop()?.toLowerCase() === path.toLowerCase()
  );
}

export function Breadcrumbs() {
  const sideNavCopy = useSideNavCopy();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const pageCopy = usePageCopy(pathnames[0]);

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {pathnames.map((path, index) => {
        let match =
          findTopNavMatch(sideNavCopy, path) || findSubNavMatch(pageCopy, path);
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return last ? (
          <Box display="flex" gap="0.5rem" color="primary.main" key={to}>
            <IconFromString icon={match?.icon || ""} />
            <Typography color="text.primary">
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
