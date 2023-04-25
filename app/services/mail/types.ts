export type EmailType = {
  to: string;
  from: string;
  replyTo?: string | null;
  subject: string;
  text?: string | null;
  html?: string | null;
};
