import type { PortableTextBlock } from "@portabletext/types"

export type AuthFormCopy = {
  _id: "authForm"
  email: string,
  password: string
  rememberMe: string
  createAccount: string
  login: string
  noAccountMessage: string
  noAccountLoginLink: string
  existingAccountMessage: string
  existingAccountLoginLink: string
  forgotPasswordLink: string
  alreadyKnowPasswordLink: string
  alreadyKnowPasswordMessage: string
  sendPasswordReset: string
  joinMessage: string
  joinAcceptTermsLabel: Array<{
    _type: "content"
    key: string
    value: PortableTextBlock[]
  }>
}

export type AuthSidebarCopy = {
  _type: "content"
  _id: "authSidebar"
  content: any
}