import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { sendMail } from "~/services/mail/sendMail.server";
import { createOrganization } from "./organization.server";
import {
  createSixCharacterCode,
  getUserPasswordError,
  validateEmail,
} from "~/utils";
import { getUserFullName } from "~/utils/user/getUserFullName";
import { renderEmailFromTemplate } from "~/services/sanity/emailTemplates";
import { getDomainUrl } from "~/utils/url.server";
import { sendVerificationToken } from "./verificationToken.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export type NewUserValidationResult = {
  success: boolean;
  errors?: {
    email: string | null;
    password: string | null;
    acceptTerms: string | null;
    orgCreation: string | null;
  };
};

export async function validateNewUser(
  email?: string,
  password?: string,
  acceptTerms?: boolean
): Promise<NewUserValidationResult> {
  let errors: Partial<NewUserValidationResult["errors"]> = {};

  if (!acceptTerms) {
    errors.acceptTerms =
      "You must accept the terms and conditions to continue.";
  }

  if (!validateEmail(email)) {
    errors.email = "Email is invalid";
  }

  const passwordError = getUserPasswordError(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors: {
        email: errors.email || null,
        password: errors.password || null,
        acceptTerms: errors.acceptTerms || null,
        orgCreation: null,
      },
    };
  }

  const existingUser = email && (await getUserByEmail(email));
  if (existingUser) {
    // Add delay to make user enumeration more difficult
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      success: false,
      errors: {
        email: "A user already exists with this email",
        password: null,
        acceptTerms: null,
        orgCreation: null,
      },
    };
  }

  return {
    success: true,
  };
}

export async function createUser(
  request: Request,
  email: User["email"],
  password: string,
  acceptTerms: boolean
): Promise<
  | {
      user: User;
      orgId: string;
      errors: null;
    }
  | {
      user: null;
      orgId: null;
      errors: {
        email: string | null;
        password: string | null;
        acceptTerms: string | null;
        orgCreation: string | null;
      };
    }
> {
  const newUserValidation = await validateNewUser(email, password, acceptTerms);
  if (newUserValidation.success === false) {
    return {
      user: null,
      orgId: null,
      errors: {
        email: newUserValidation.errors?.email || null,
        password: newUserValidation.errors?.password || null,
        acceptTerms: newUserValidation.errors?.acceptTerms || null,
        orgCreation: newUserValidation.errors?.orgCreation || null,
      },
    };
  }

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
  const { organization, error: orgCreateError } = await createOrganization({
    email,
    userId: user.id,
    name: `${orgName}'s Organization`,
  });

  if (orgCreateError || !organization) {
    return {
      user: null,
      orgId: null,
      errors: {
        email: null,
        password: null,
        acceptTerms: null,
        orgCreation: "Server error",
      },
    };
  }

  await sendVerificationToken(request, user);

  return {
    user,
    orgId: organization.id,
    errors: null,
  };
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

async function sendPasswordResetEmail(
  request: Request,
  user: User,
  token: string
) {
  const username = getUserFullName(user) || user.email;
  const link = `${getDomainUrl(request)}/resetPassword?email=${user.email}`;
  const { html, subject } = await renderEmailFromTemplate({
    key: "passwordReset",
    variables: { username, token, link },
    fallbackSubject: "Reset your Troy password",
    fallbackBody: `
      <p>Hi {{username}},</p>
      <p>Someone requested a password reset for your Troy account. If this was you, please click the link below to reset your password. The link will expire in 24 hours.</p>
      <br />
      <br />
      <p data-testid="verification-token"><strong>{{token}}</strong></p>
      <br />
      <br />
      <p><a href="{{link}}">Enter your code here</a></p>
      <p>Thanks,</p>
      <p>The Troy Team</p>
      <p><small>If you didn't request a password reset, please ignore this email.</small></p>
    `,
  });

  return sendMail({
    to: user.email,
    subject,
    html,
  });
}

export async function createResetPasswordToken(user: User) {
  const token = createSixCharacterCode();

  return await prisma.resetPasswordToken.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    update: {
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
}

export async function forgotPassword(request: Request, email: User["email"]) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }
  const reset = await createResetPasswordToken(user);

  reset.token && (await sendPasswordResetEmail(request, user, reset.token));

  return user;
}

export async function isResetPasswordTokenValid(user: User, token: string) {
  const reset = await prisma.resetPasswordToken.findFirst({
    where: {
      token,
      userId: user.id,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  return reset ? true : false;
}

export async function resetPasswordByToken(
  user: User,
  token: string,
  newPassword: string
) {
  const valid = isResetPasswordTokenValid(user, token);

  if (!valid) {
    return null;
  }

  return prisma.user.update({
    where: { id: user.id },
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
