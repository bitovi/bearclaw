import { useMatches } from "@remix-run/react";
import { getClient } from "~/services/sanity/getClient";
import type {
  AuthSidebarCopy,
  AuthFormCopy,
  AuthImages,
  AuthPageCopy,
  AuthPageCopyKeyed,
} from "./types";

function isAuthSidebarCopy(copy: any): copy is AuthSidebarCopy {
  return copy?._id === "authSidebar";
}

function isAuthFormCopy(copy: any): copy is AuthFormCopy {
  return copy?._id === "authForm";
}

function isAuthImages(copy: any): copy is AuthImages {
  return copy?._id === "sidebarImages";
}

function isAuthPageCopy(copy: any): copy is AuthPageCopy {
  return copy && copy._type === "authPage" && copy.key;
}

export async function fetchAuthCopy() {
  try {
    const authCopyQuery = `*[_id == "authSidebar" || _id == "authForm" || _type == "authPage"]{
      ...,
      "images": images[] {
      altText,
      name,
      hidden,
      'url': asset->url
    }
    }`;
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

    const pageCopy = await getClient().fetch<
      [AuthSidebarCopy | AuthFormCopy | AuthPageCopy]
    >(authCopyQuery);
    console.log("page Copy", pageCopy);
    const pageImages = await getClient().fetch<[AuthImages]>(authImagesQuery);

    const sidebarCopy = pageCopy?.find(isAuthSidebarCopy);
    const authPageCopy = pageCopy?.filter(isAuthPageCopy);

    const formCopy = pageCopy?.find(isAuthFormCopy);
    const authImages = pageImages?.find(isAuthImages);

    return { sidebarCopy, formCopy, authImages, authPageCopy };
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

export function useAllAuthPageCopy(): Record<string, AuthPageCopyKeyed> {
  const matches = useMatches();
  const pages = matches.find((match) => {
    return match.data?.authPageCopy;
  })?.data.authPageCopy;

  return pages.reduce((acc: Record<string, AuthPageCopyKeyed>, page: any) => {
    if (!isAuthPageCopy(page)) return acc;
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

export function useAuthPageCopy(key: string): AuthPageCopyKeyed | null {
  const pages = useAllAuthPageCopy();
  return pages[key];
}
