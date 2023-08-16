import { prisma } from "~/db.server";
import { createSixCharacterCode, safeRedirect } from "~/utils";
import { getUser } from "~/session.server";
import invariant from "tiny-invariant";
import { getDomainUrl } from "~/utils/url.server";
import { renderEmailFromTemplate } from "~/services/sanity/emailTemplates";
import { getUserFullName } from "~/utils/user/getUserFullName";
import { sendMail } from "~/services/mail/sendMail.server";
import type { User } from "@prisma/client";

export async function createVerificationToken(userId: string) {
  const token = createSixCharacterCode();
  return await prisma.verificationToken.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    update: {
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
}

export async function deleteVerificationToken(id: string) {
  return await prisma.verificationToken.delete({
    where: {
      id,
    },
  });
}

export async function sendVerificationToken(
  request: Request,
  user?: User | null
) {
  user = user || (await getUser(request));
  invariant(user, "User is required");
  const url = new URL(request.url);
  const redirectTo = safeRedirect({ to: url.searchParams.get("redirectTo") });
  const redirectParam = redirectTo
    ? `&redirectTo=${encodeURIComponent(redirectTo)}`
    : "";
  const { token } = await createVerificationToken(user.id);
  const link = `${getDomainUrl(
    request
  )}/verifyEmail?token=${token}${redirectParam}`;
  const username = getUserFullName(user) || user.email;

  const { html, subject } = await renderEmailFromTemplate({
    key: "verifyEmailAddress",
    variables: { username, token, link },
    fallbackSubject: "Welcome to Troy! Please verify your email address.",
    fallbackBody: `
      <p>Hi {{username}},</p>
      <p>Thanks for signing up for Troy! Please verify your email address by entering the provided 6-digit code at the link provided below. The code will expire in 24 hours.</p>
      <br />
      <br />
      <p data-testid="verification-token"><strong>{{token}}</strong></p>
      <br />
      <br />
      <p><a href="{{link}}">Enter code here</a></p>
      <p>Thanks,</p>
      <p>The Troy Team</p>
      <p><small>If you didn't sign up for Troy, please ignore this email.</small></p>
    `,
  });
  return sendMail({
    to: user.email,
    subject,
    html,
  });
}

export async function retrieveVerificationToken(
  userId: string,
  tokenCode: string
) {
  const token = await prisma.verificationToken.findFirst({
    where: {
      userId,
      token: tokenCode,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  if (!token) {
    return {
      token: false,
      error: "No token found for provided code",
    };
  }

  await deleteVerificationToken(token.id);
  return {
    token: true,
    error: "",
  };
}
