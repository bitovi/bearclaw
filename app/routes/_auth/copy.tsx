import { useMatches } from "@remix-run/react"
import { getClient } from "~/lib/sanity/getClient.server"
import type { AuthSidebarCopy, AuthFormCopy } from "./types";

function isAuthSidebarCopy (copy: any): copy is AuthSidebarCopy {
  return copy._id === "authSidebar"
}

function isAuthFormCopy (copy: any): copy is AuthFormCopy {
  return copy._id === "authForm"
}

export async function fetchAuthCopy() {
  const query = `*[_id == "authSidebar" || _id == "authForm"]{...}`;
  const pageCopy = await getClient().fetch<[AuthSidebarCopy | AuthFormCopy]>(query)

  const sidebarCopy = pageCopy.find(isAuthSidebarCopy)
  const formCopy = pageCopy.find(isAuthFormCopy)

  return { sidebarCopy, formCopy }
}

/**
 * Hook to access the form copy from the parent route
 */
export function useParentFormCopy(): AuthFormCopy | null {
  const matches = useMatches();
  const copyMatch = matches.find(match => match.data.formCopy)?.data.formCopy
  return isAuthFormCopy(copyMatch) ? copyMatch : null
}