import dayjs from "dayjs";
import { prisma } from "~/db.server";
import { sendMail } from "~/services/mail/sendMail";

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

export function sendInvitationTokenEmail(email: string, token: string) {
  return sendMail({
    to: email,
    from: "noreply@example.com",
    subject: "BEARCLAW -- Organization Invitation",
    html: `
      <p>Hi ${email},</p>
      <p>Someone has invited you to join their organization.</p>
      <p>Please click on the link below and sign in or sign up to accept their invitation. The link will expire in seven days.</p>
      <a href="/invite/${token}">Join here</a>
      <p>Thanks,</p>
      <p>The BearClaw Team</p>
    `,
  });
}

export async function destroyInviteToken(id: string) {
  return await prisma.invitationToken.delete({ where: { id } });
}

export async function validateInvitiationToken(id: string) {
  const inviteToken = await prisma.invitationToken.findFirst({
    where: {
      id,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  if (!inviteToken) {
    return false;
  }

  return inviteToken;
}

export async function inviteUser(email: string, orgId: string) {
  const tokenId = await generateInvitationToken(email, orgId);
  await sendInvitationTokenEmail(email, tokenId);
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
