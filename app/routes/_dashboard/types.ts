import { PortableTextBlock } from '@portabletext/types'

export type CopyLink = {
  _type: "link"
  _key: string
  text: string
  icon?: string
  ariaLabel?: string
  to: string
  newTab?: boolean
  requiredPermissions: Array<
  | "subscriptionView"
  | "subscriptionEdit"
  | "subscriptionCreate"
  | "orgUsersView"
  | "orgUsersEdit"
  | "orgUsersCreate"
  >
}

export type SideNavCopy = {
  _type: "dashboardSideNav"
  _id: "dashboardSideNav"
  dividerAfter?: number
  links: Array<CopyLink>
}

export function isSideNavCopy (copy: any): copy is SideNavCopy {
  return copy._id === "dashboardSideNav"
}

export type PageCopy = {
  _type: "page"
  _id: string
  key: string
  breadcrumb: string
  title: string
  headline: string
  subNavLinks?: Array<CopyLink>
  content?: Array<{
    _type: "content"
    key: string
    value: string
  }>
  richContent?: Array<{
    _type: "content"
    key: string
    value: PortableTextBlock[]
  }>
}

export function isPageCopy (copy: any): copy is PageCopy {
  return copy && copy._type === "page" && copy.key
}