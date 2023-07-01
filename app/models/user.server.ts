import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { sendMail } from "~/services/mail/sendMail";
import { createId } from "@paralleldrive/cuid2";
import { createOrganization } from "./organization.server";
import { createVerificationToken } from "./verificationToken.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export function sendEmailVerificationEmail({
  user,
  redirectTo,
  verificationToken,
}: {
  user: User;
  redirectTo?: string;
  verificationToken: number;
}) {
  const redirectParam = redirectTo
    ? `&redirectTo=${encodeURIComponent(redirectTo)}`
    : "";
  return sendMail({
    to: user.email,
    from: "noreply@example.com",
    subject: "Welcome to BearClaw! Please verify your email address.",
    html: `
      <p>Hi ${user.email},</p>
      <p>Thanks for signing up for BearClaw! Please verify your email address by entering the provided 6-digit code at the link provided below. The code will expire in 24 hours.</p>
      <br />
      <br />
      <p data-testid="verification-token"><strong>${verificationToken}</strong></p>
      <br />
      <br />
      <p><a href="/verifyEmail?${redirectParam}">Enter code here</a></p>
      <p>Thanks,</p>
      <p>The BearClaw Team</p>
      <p><small>If you didn't sign up for BearClaw, please ignore this email.</small></p>
    `,
  });
}

export async function createUser(
  email: User["email"],
  password: string,
  redirectTo?: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  // For the time being, whenever we create a user we create an organization associated with that user, of which they are the owner. This will likely be expanded so that users created through invitation links can skip this step and register with a pre-existing organization
  const orgName = email.split("@")[0];
  const { organization, error } = await createOrganization({
    email,
    userId: user.id,
    name: `${orgName}'s Organization`,
  });

  const verificationToken = await createVerificationToken(user.id);
  await sendEmailVerificationEmail({
    user,
    redirectTo,
    verificationToken: verificationToken.numericCode,
  });

  return { user, orgId: organization?.id, error };
}

export type EmailValidationResult = {
  status: "success" | "notFound" | "alreadyVerified" | "expired";
  error?: boolean;
};

export async function validateUser(id: string): Promise<EmailValidationResult> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return { status: "notFound", error: true };
  }
  if (user.emailVerifiedAt) {
    return { status: "alreadyVerified", error: false };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
    },
  });

  return { status: "success", error: false };
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

function sendPasswordResetEmail(user: User, token: string) {
  return sendMail({
    to: user.email,
    from: "noreply@example.com",
    subject: "Reset your BearClaw password",
    html: `
      <p>Hi ${user.email},</p>
      <p>Someone requested a password reset for your BearClaw account. If this was you, please click the link below to reset your password. The link will expire in 24 hours.</p>
      <p><a href="/resetPassword?token=${token}">Reset your password</a></p>
      <p>Thanks,</p>
      <p>The BearClaw Team</p>
      <p><small>If you didn't request a password reset, please ignore this email.</small></p>
    `,
  });
}

export async function forgotPassword(email: User["email"]) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const reset = await prisma.resetPasswordToken.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      token: createId(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    update: {
      token: createId(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  reset.token && (await sendPasswordResetEmail(user, reset.token));

  return user;
}

export async function isResetPasswordTokenValid(token: string) {
  const reset = await prisma.resetPasswordToken.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  return reset ? true : false;
}

export async function resetPasswordByToken(token: string, newPassword: string) {
  const reset = await prisma.resetPasswordToken.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!reset || !reset.user || !reset.expiresAt) {
    return null;
  }

  if (reset.expiresAt < new Date()) {
    return null;
  }

  return prisma.user.update({
    where: { id: reset.user.id },
    data: {
      password: {
        update: {
          hash: bcrypt.hashSync(newPassword, 10),
        },
      },
      resetPasswordToken: {
        delete: true,
      },
    },
  });
}
