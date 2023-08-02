import { useMatches } from "@remix-run/react";
import { getClient } from "~/services/sanity/getClient";
import type {
  HeaderMenuCopy,
  PageCopy,
  PageCopyKeyed,
  SideNavCopy,
} from "./types";
import { isHeaderMenuCopy, isPageCopy, isSideNavCopy } from "./types";

export async function fetchDashboardCopy() {
  const query = `*[
    _id == "dashboardSideNav" ||
    _id == "dashboardHeaderMenu" ||
    _type == "page"
  ]{
    ...,
    "images": images[] {
      altText,
      name,
      hidden,
      'url': asset->url
    }

  }`;
  try {
    const copy = await getClient().fetch<[SideNavCopy | PageCopy] | null>(
      query
    );
    const headerMenuCopy = copy?.find(isHeaderMenuCopy);
    const sideNavCopy = copy?.find(isSideNavCopy);
    const pageCopy = copy?.filter(isPageCopy);

    return { headerMenuCopy, sideNavCopy, pageCopy };
  } catch (err) {
    console.log(err);
  }
}

/**
 * Hook to access the header copy from the parent route
 */
export function useHeaderMenuCopy(): HeaderMenuCopy | null {
  const matches = useMatches();
  const copyMatch = matches.find((match) => match.data.copy?.headerMenuCopy)
    ?.data.copy.headerMenuCopy;

  return isHeaderMenuCopy(copyMatch) ? copyMatch : null;
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
        images: page.images?.reduce((acc, image) => {
          return {
            ...acc,
            [image.name]: image,
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
