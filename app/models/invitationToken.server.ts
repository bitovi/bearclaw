import dayjs from "dayjs";
import { prisma } from "~/db.server";
import { sendMail } from "~/services/mail/sendMail.server";
import { renderEmailFromTemplate } from "~/services/sanity/emailTemplates";
import { getDomainUrl } from "~/utils/url.server";

export async function generateInvitationToken(
  guestEmail: string,
  organizationId: string
) {
  const inviteToken = {
    expiresAt: dayjs().add(7, "day").toDate(),
    organizationId,
    guestEmail,
  };

  const token = await prisma.invitationToken.upsert({
    where: {
      guestEmail_organizationId: {
        organizationId,
        guestEmail,
      },
    },
    update: inviteToken,
    create: {
      ...inviteToken,
    },
  });

  return token.id;
}

export async function retrieveInvitationToken(id: string) {
  return await prisma.invitationToken.findUnique({ where: { id } });
}

export async function destroyInviteToken(id: string) {
  return await prisma.invitationToken.delete({ where: { id } });
}

export async function validateInvitationToken(id: string, email: string) {
  const inviteToken = await prisma.invitationToken.findFirst({
    where: {
      id,
      expiresAt: {
        gte: new Date(),
      },
      guestEmail: email,
    },
  });

  if (!inviteToken) {
    return false;
  }

  return inviteToken;
}

export async function inviteUser(
  request: Request,
  email: string,
  orgId: string
) {
  const token = await generateInvitationToken(email, orgId);
  const link = `${getDomainUrl(
    request
  )}/invite?inviteToken=${token}&email=${email}`;

  const { html, subject } = await renderEmailFromTemplate({
    key: "organizationInvitation",
    variables: { email, link },
    fallbackSubject: "TROY -- Organization Invitation",
    fallbackBody: `
      <p>Hi {{email}},</p>
      <p>Someone has invited you to join their organization.</p>
      <p>Please click on the link below and sign in or sign up to accept their invitation. The link will expire in seven days.</p>
      <a data-testid="{{email}}-link" href="{{link}}">Join here</a>
      <p>Thanks,</p>
      <p>The Troy Team</p>
    `,
  });

  return sendMail({
    to: email,
    subject,
    html,
  });
}

/**
 * Pull the invite token from the pathname passed through redirect
 * @param string pathname of URL
 * @returns
 */
export function returnInviteToken(string: string) {
  const arrayString = string.split("/");
  let result: string | undefined;

  arrayString.forEach((str, i) => {
    if (str.trim() === "invite") {
      result = arrayString[i + 1].trim();
      return;
    }
  });

  return result;
}
