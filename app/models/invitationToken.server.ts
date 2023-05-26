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

export function sendInvitationTokenEmail(email: string, token: string) {
  return sendMail({
    to: email,
    from: "noreply@example.com",
    subject: "BEARCLAW -- Organization Invitation",
    html: `
      <p>Hi ${email},</p>
      <p>Someone has invited you to join their organization.</p>
      <p>Please click on the following link and sign in to accept their invitation:</p>
      <a href="${process.env.BEAR_CLAW_SERVER}/login?invite=${token}">Join here</a>
      <p><b><span data-testid="inviteToken">${token}</span></b></p>
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

  await destroyInviteToken(id);

  return true;
}
