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
        const page = index === 0 ? pageCopy : null;
        const navLink =
          page && page?.breadcrumb && page.breadcrumbIcon
            ? null
            : findTopNavMatch(sideNavCopy, path) ||
              findSubNavMatch(pageCopy, path);
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        const linkProps = last
          ? ({ component: "div", underline: "none" } as const)
          : ({ component: RouterLink, to, underline: "hover" } as const);

        return (
          <Link
            {...linkProps}
            key={to}
            display="flex"
            gap="0.5rem"
            color="grey.800"
          >
            <Box color={last ? "primary.main" : undefined}>
              <IconFromString
                icon={page?.breadcrumbIcon || navLink?.icon || ""}
              />
            </Box>
            <Typography color="text.primary">
              {page?.breadcrumb || navLink?.text || toTitleCase(path)}
            </Typography>
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
