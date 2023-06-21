import { useMatches } from "@remix-run/react"
import { getClient } from "~/lib/sanity/getClient.server"
import type { PageCopy, SideNavCopy } from "./types";
import { isPageCopy, isSideNavCopy } from "./types";

export async function fetchDashboardCopy() {
  const query = `*[
    _id == "dashboardSideNav" ||
    _type == "page"
  ]{...}`;

  const copy = await getClient().fetch<[
    SideNavCopy | PageCopy
  ]>(query)
  
  const sideNavCopy = copy.find(isSideNavCopy)
  const pageCopy = copy.filter(isPageCopy)
  console.log(pageCopy)

  return { sideNavCopy, pageCopy }
}

/**
 * Hook to access the navigation copy from the parent route
*/
export function useSideNavCopy(): SideNavCopy | null {
  const matches = useMatches();
  const copyMatch = matches.find(match => match.data.copy?.sideNavCopy)?.data.copy.sideNavCopy

  return isSideNavCopy(copyMatch) ? copyMatch : null
}

/**
 * Hook to access the page copy from the parent route
 */
export function usePageCopy(key: string): PageCopy | null {
  const matches = useMatches();
  const pages = matches.find(match => match.data?.copy?.pageCopy)?.data.copy.pageCopy
  if (!pages) return null
  const copyMatch = pages.find((page: any) => isPageCopy(page) && page.key === key)

  return isPageCopy(copyMatch) ? copyMatch : null
}