import type { PortableTextBlock } from "@portabletext/types";
import { QuestionType } from "~/services/sanity/copy/questions/types";

export type CopyLink = {
  _type: "link";
  _key: string;
  text: string;
  icon?: string;
  ariaLabel?: string;
  to: string;
  newTab?: boolean;
  requiredPermissions: Array<
    | "subscriptionView"
    | "subscriptionEdit"
    | "subscriptionCreate"
    | "orgUsersView"
    | "orgUsersEdit"
    | "orgUsersCreate"
  >;
};

export type SideNavCopy = {
  _type: "dashboardSideNav";
  _id: "dashboardSideNav";
  dividerAfter?: number;
  links: Array<CopyLink>;
};

export function isSideNavCopy(copy: any): copy is SideNavCopy {
  return copy && copy._id === "dashboardSideNav";
}

export type PageCopy = {
  _type: "page";
  _id: string;
  key: string;
  breadcrumb: string;
  title: string;
  headline: string;
  subNavLinks?: Array<CopyLink>;
  content?: Array<{
    _type: "content";
    key: string;
    value: string;
  }>;
  inputs?: Array<QuestionType>;
  richContent?: Array<{
    _type: "content";
    key: string;
    value: PortableTextBlock[];
  }>;
};

export type PageCopyKeyed = Omit<
  PageCopy,
  "content" | "richContent" | "inputs"
> & {
  content?: Record<string, string>;
  richContent?: Record<string, PortableTextBlock[]>;
  inputs?: Record<string, QuestionType>;
};

export function isPageCopy(copy: any): copy is PageCopy {
  return copy && copy._type === "page" && copy.key;
}
