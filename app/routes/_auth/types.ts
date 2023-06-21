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
}

export type AuthSidebarCopy = {
  _type: "content"
  _id: "authSidebar"
  content: any
}