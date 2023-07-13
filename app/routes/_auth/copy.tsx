import { useMatches } from "@remix-run/react";
import { getClient } from "~/services/sanity/getClient";
import type { AuthSidebarCopy, AuthFormCopy, AuthImages } from "./types";

function isAuthSidebarCopy(copy: any): copy is AuthSidebarCopy {
  return copy?._id === "authSidebar";
}

function isAuthFormCopy(copy: any): copy is AuthFormCopy {
  return copy?._id === "authForm";
}

function isAuthImages(copy: any): copy is AuthImages {
  return copy?._id === "sidebarImages";
}

export async function fetchAuthCopy() {
  try {
    const authCopyQuery = `*[_id == "authSidebar" || _id == "authForm"]{...}`;
    const authImagesQuery = `*[_id == 'sidebarImages']{
      _id,
     "imageURLs": imageContent[] {
        "key": _key,
        location,
        altText,
        name,
        hidden,
        'url': asset->url
      }
    }`;

    const pageCopy = await getClient().fetch<[AuthSidebarCopy | AuthFormCopy]>(
      authCopyQuery
    );
    const pageImages = await getClient().fetch<[AuthImages]>(authImagesQuery);

    const sidebarCopy = pageCopy.find(isAuthSidebarCopy);
    const formCopy = pageCopy.find(isAuthFormCopy);
    const authImages = pageImages?.find(isAuthImages);

    return { sidebarCopy, formCopy, authImages };
  } catch (err) {
    console.error(err);
  }
}

/**
 * Hook to access the form copy from the parent route
 */
export function useParentFormCopy(): AuthFormCopy | null {
  const matches = useMatches();
  const copyMatch = matches.find((match) => match.data.formCopy)?.data.formCopy;
  return isAuthFormCopy(copyMatch) ? copyMatch : null;
}

/**
 * Hook to access the sidebar copy from the parent route
 */
export function useParentSidebarCopy(): AuthSidebarCopy | null {
  const matches = useMatches();
  const copyMatch = matches.find((match) => match.data.sidebarCopy)?.data
    .sidebarCopy;

  return isAuthSidebarCopy(copyMatch) ? copyMatch : null;
}

export function useParentImageCopy(): AuthImages | null {
  const matches = useMatches();
  const copyMatch = matches.find((match) => match.data.authImages)?.data
    .authImages;

  return isAuthImages(copyMatch) ? copyMatch : null;
}
