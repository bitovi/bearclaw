import type { Organization } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { appendRedirectWithOrgId } from "./utils";
invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";
const ORGANIZATION_KEY = "orgId";
const MFA_STATUS_KEY = "mfaStatus";

type MfaStatus = "success" | "pending" | null;

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getMfaStatus(request: Request): Promise<MfaStatus> {
  const session = await getSession(request);
  const status = session.get(MFA_STATUS_KEY);
  return status;
}

export async function setMfaStatus(
  request: Request,
  mfaStatus: MfaStatus
): Promise<void> {
  const session = await getSession(request);
  session.set(MFA_STATUS_KEY, mfaStatus);
  return;
}

export async function getOrgId(
  request: Request
): Promise<Organization["id"] | undefined> {
  const session = await getSession(request);
  const orgId = session.get(ORGANIZATION_KEY);
  return orgId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;
  throw await logout(request);
}

export async function getOrgandUserId(request: Request): Promise<{
  userId: User["id"];
  organizationId: Organization["id"];
}> {
  const session = await getSession(request);
  const organizationId = session.get(ORGANIZATION_KEY);
  const userId = session.get(USER_SESSION_KEY);

  if (!organizationId || !userId) throw await logout(request);

  return { organizationId, userId };
}

export async function requireUserId(
  request: Request,
  redirectTo: string = request.url
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  const mfaStatus = await getMfaStatus(request);
  if (mfaStatus === "pending") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/mfa?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) {
    if (!user.emailVerifiedAt) {
      const url = new URL(request.url);
      const redirectTo = `redirectTo=${url.pathname}${url.search}`;
      throw redirect(`/verifyEmail?${redirectTo}`);
    }
    return user;
  }

  throw await logout(request);
}

export async function changeUserOrganizationSession({
  request,
  organizationId,
  redirectTo,
}: {
  request: Request;
  organizationId: string;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(ORGANIZATION_KEY, organizationId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}

export async function createUserSession({
  request,
  userId,
  orgId,
  mfaEnabled,
  remember,
  redirectTo: _redirectTo,
}: {
  request: Request;
  userId: string;
  orgId: string;
  mfaEnabled: boolean;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  session.set(ORGANIZATION_KEY, orgId);
  mfaEnabled && session.set(MFA_STATUS_KEY, "pending");

  const redirectTo = appendRedirectWithOrgId(_redirectTo, orgId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function mfaActivateUserSession({
  request,
  redirectTo,
}: {
  request: Request;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(MFA_STATUS_KEY, "success");

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  const searchParams = new URLSearchParams([["redirectTo", request.url]]);
  return redirect(`/login?${searchParams}`, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
