import { useMatches } from "@remix-run/react";
import { getClient } from "~/services/sanity/getClient";
import type { PageCopy, PageCopyKeyed, SideNavCopy } from "./types";
import { isPageCopy, isSideNavCopy } from "./types";

export async function fetchDashboardCopy() {
  const query = `*[
    _id == "dashboardSideNav" ||
    _type == "page"
  ]{...}`;
  try {
    const copy = await getClient().fetch<[SideNavCopy | PageCopy] | null>(
      query
    );
    const sideNavCopy = copy?.find(isSideNavCopy);
    const pageCopy = copy?.filter(isPageCopy);

    return { sideNavCopy, pageCopy };
  } catch (err) {
    console.log(err);
  }
}

/**
 * Hook to access the navigation copy from the parent route
 */
export function useSideNavCopy(): SideNavCopy | null {
  const matches = useMatches();
  const copyMatch = matches.find((match) => match.data.copy?.sideNavCopy)?.data
    .copy.sideNavCopy;

  return isSideNavCopy(copyMatch) ? copyMatch : null;
}

/**
 * Hook to access all the page copy from the parent route
 */
export function useAllPageCopy(): Record<string, PageCopyKeyed> {
  const matches = useMatches();
  const pages = matches.find((match) => {
    return match.data?.copy?.pageCopy;
  })?.data.copy.pageCopy;

  return pages.reduce((acc: Record<string, PageCopyKeyed>, page: any) => {
    if (!isPageCopy(page)) return acc;
    return {
      ...acc,
      [page.key]: {
        ...page,
        content: page.content?.reduce(
          (acc, content) => ({
            ...acc,
            [content.key]: content.value,
          }),
          {}
        ),
        inputs: page.inputs?.reduce((acc, input) => {
          return {
            ...acc,
            [input.name]: input,
          };
        }, {}),
        richContent: page.richContent?.reduce(
          (acc, content) => ({
            ...acc,
            [content.key]: content.value,
          }),
          {}
        ),
      },
    };
  }, {});
}

/**
 * Hook to access the specific page copy from the parent route
 */
export function usePageCopy(key: string): PageCopyKeyed | null {
  const pages = useAllPageCopy();
  return pages[key];
}
