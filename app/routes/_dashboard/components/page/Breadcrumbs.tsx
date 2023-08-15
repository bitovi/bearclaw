import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { IconFromString } from "~/components/iconFromString/IconFromString";
import { usePageCopy, useSideNavCopy } from "~/routes/_dashboard/copy";
import { toTitleCase } from "~/utils/string/toTitleCase";
import { useParams } from "@remix-run/react";

function findTopNavMatch(
  sideNavCopy: ReturnType<typeof useSideNavCopy>,
  path: string
) {
  return sideNavCopy?.links.find((link) => {
    const protectedPath = link.to.match(/\{\{\w+\}\}/);
    if (protectedPath) {
      // if this is a protected mustache'd path, first remove the placeholder variable and continue process
      const filteredPath = link.to
        .split("/")
        .filter((val) => val && val !== protectedPath[0]);
      return (
        filteredPath.join("/").match(/\w+/)?.[0]?.toLowerCase() ===
        path.toLowerCase()
      );
    }
    return link.to.match(/\w+/)?.[0]?.toLowerCase() === path.toLowerCase();
  });
}

function findSubNavMatch(
  pageCopy: ReturnType<typeof usePageCopy>,
  path: string
) {
  return pageCopy?.subNavLinks?.find(
    (link) => link.to.split("/").pop()?.toLowerCase() === path.toLowerCase()
  );
}
/**
 *
 * @param detailPage supports the unique breadcrumb scenario wherein nested navigation stops at the File Results level and does not attempt to continue the pattern of nested page navigation logic
 */
export function Breadcrumbs({ detailPage }: { detailPage?: boolean }) {
  const sideNavCopy = useSideNavCopy();
  const { organization: organizationId } = useParams();
  const location = useLocation();
  const pathnames = detailPage
    ? ["history", "detail"]
    : location.pathname.split("/").filter((x) => x && x !== organizationId); // remove dynamic orgId value
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
        const to =
          path === "detail"
            ? undefined
            : `/${organizationId ? organizationId : ""}/${pathnames
                .slice(0, index + 1)
                .join("/")}`;

        const linkProps = last
          ? ({ component: "div", underline: "none" } as const)
          : ({ component: RouterLink, to, underline: "hover" } as const);

        return (
          <Link
            {...linkProps}
            key={to || path}
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
