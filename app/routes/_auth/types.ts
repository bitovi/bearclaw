import type { PortableTextBlock } from "@portabletext/types";

export type AuthFormCopy = {
  _id: "authForm";
  needHelp: Array<{
    _type: "content";
    key: string;
    value: PortableTextBlock[];
  }>;
  loginSubHeader: string;
  joinSubHeader: string;
  email: string;
  password: string;
  rememberMe: string;
  createAccountButton: string;
  login: string;
  noAccountMessage: string;
  noAccountLoginLink: string;
  existingAccountMessage: string;
  existingAccountLoginLink: string;
  forgotPasswordLink: string;
  sendPasswordReset: string;
  joinAcceptTermsLabel: Array<{
    _type: "content";
    key: string;
    value: PortableTextBlock[];
  }>;
  returnToSignInCTA: string;
  resendCode: string;
  dontHaveCode: string;
  verifyEmailButton: string;
  verifyEmailInstructionPart2: string;
  verifyEmailInstructionPart1: string;
  checkYourEmail: string;
  signUpWithGithub: string;
  loginWithGithub: string;
  passwordRequestSent: string;
  passwordResetSuccessMessage: string;
  passwordReset: string;
  signin: string;
  forgotPasswordSubHeader: string;
  forgotYourPassword: string;
  confirmPassword: string;
};

export type AuthSidebarCopy = {
  _type: "content";
  _id: "authSidebar";
  content: any;
};

export type AuthImages = {
  imageURLs: {
    key: string;
    hidden: boolean;
    url: string;
    altText: string;
  }[];
};
