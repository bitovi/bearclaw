import type { MfaMethod, User } from "@prisma/client";
import dayjs from "dayjs";

import { prisma } from "~/db.server";
import { sendMail } from "~/services/mail/sendMail";

function generateMfaToken(length = 6) {
  let token = Math.random().toString().slice(-length);
  while (token.length < length) {
    token = "0" + token;
  }
  return token;
}

export function sendMfaTokenEmail(email: string, token: string) {
  return sendMail({
    to: email,
    from: "noreply@example.com",
    subject: "BEARCLAW MFA",
    html: `
      <p>Hi ${email},</p>
      <p>Please verify your login attempt with the code below. The code will expire in 5 minutes.</p>
      <p><b><span data-testid="token">${token}</span></b></p>
      <p>Thanks,</p>
      <p>The BearClaw Team</p>
    `,
  });
}

export async function createMfaEmailValidationToken(user: User) {
  const mfaToken = {
    type: "email",
    expiresAt: dayjs().add(5, "minute").toDate(),
    token: generateMfaToken(),
  };

  return await prisma.mfaToken.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type: "email",
      },
    },
    update: mfaToken,
    create: {
      userId: user.id,
      ...mfaToken,
    },
  });
}

export function getUserMfaMethods(user: User) {
  return prisma.mfaMethod.findMany({
    where: { userId: user.id, active: true },
  });
}

export async function createMfaToken({
  type,
  user,
}: {
  type: MfaMethod["type"];
  user: User;
}) {
  const token = generateMfaToken();
  return prisma.mfaToken.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type: type,
      },
    },
    create: {
      userId: user.id,
      type: type,
      expiresAt: dayjs().add(5, "minute").toDate(),
      token,
    },
    update: {
      expiresAt: dayjs().add(5, "minute").toDate(),
      token,
    },
  });
}

export async function resetMfaToken({
  type,
  user,
}: {
  type: MfaMethod["type"];
  user: User;
}) {
  const mfaToken = await createMfaToken({ type, user });
  await sendMfaTokenEmail(user.email, mfaToken.token);
}

export async function updateUserMfaMethod({
  user,
  type,
  active,
}: { user: User } & Pick<MfaMethod, "active" | "type">) {
  const mfaMethod = await prisma.mfaMethod.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type: type,
      },
    },
    update: {
      active: active,
      updatedAt: new Date(),
      verifiedAt: active ? undefined : null,
    },
    create: {
      userId: user.id,
      type: type,
      active: active,
    },
  });

  if (active) {
    const mfaToken = await createMfaToken({ type, user });
    await sendMfaTokenEmail(user.email, mfaToken.token);
  } else {
    await prisma.mfaToken.deleteMany({
      where: {
        userId: user.id,
        type: type,
      },
    });
  }

  return mfaMethod;
}

export async function verifyMfaMethod({
  user,
  type,
  token,
}: {
  user: User;
  type: MfaMethod["type"];
  token: string;
}) {
  const mfaToken = await validateAndDestroyMfaToken({ user, type, token });

  if (!mfaToken) {
    return false;
  }

  const mfaMethod = await prisma.mfaMethod.update({
    where: {
      userId_type: {
        userId: user.id,
        type: type,
      },
    },
    data: {
      active: true,
      updatedAt: new Date(),
      verifiedAt: new Date(),
    },
  });

  return mfaMethod ? true : false;
}

export async function validateAndDestroyMfaToken({
  user,
  type,
  token,
}: {
  user: User;
  type: MfaMethod["type"];
  token: string;
}): Promise<boolean> {
  const mfaToken = await prisma.mfaToken.findFirst({
    where: {
      userId: user.id,
      type: type,
      token: token,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  if (!mfaToken) {
    return false;
  }

  await prisma.mfaToken.delete({
    where: {
      id: mfaToken.id,
    },
  });

  return true;
}
