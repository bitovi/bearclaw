export type EmailType = {
  to: string;
  from?: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
};
