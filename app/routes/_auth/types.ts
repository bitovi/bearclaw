import type { PortableTextBlock } from "@portabletext/types";
import type { QuestionType } from "~/services/sanity/copy/questions/types";

export type AuthFormCopy = {
  _id: "authForm";
  needHelp: Array<{
    _type: "content";
    key: string;
    value: PortableTextBlock[];
  }>;
  loginSubHeader: string;
  joinSubHeader: string;
  onboardingSubHeader: string;
  profileBuilder: string;
  profileBuilderStep1Label: string;
  profileBuilderSkipButton: string;
  profileBuilderPreviousButton: string;
  profileBuilderSubmitButton: string;
  profileBuilderNextButton: string;
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
  _id: "sidebarImages";
  imageURLs: {
    key: string;
    hidden: boolean;
    url: string;
    altText: string;
    name: string;
    location: "onboarding" | "auth";
  }[];
};

export type AuthPageCopy = {
  _type: "page";
  _id: string;
  key: string;
  title: string;
  headline: string;
  content?: Array<{
    _type: "content";
    key: string;
    value: string;
  }>;
  images: Array<{
    name: string;
    hidden: boolean;
    altText: string;
    url: string;
  }>;
  inputs?: Array<QuestionType>;
  richContent?: Array<{
    _type: "content";
    key: string;
    value: PortableTextBlock[];
  }>;
};

export type AuthPageCopyKeyed = Omit<
  AuthPageCopy,
  "content" | "richContent" | "inputs"
> & {
  content?: Record<string, string>;
  richContent?: Record<string, PortableTextBlock[]>;
  inputs?: Record<string, QuestionType>;
  images?: Record<string, AuthPageCopy["images"][number]>;
};
