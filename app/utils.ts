import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import type Stripe from "stripe";

import type { User } from "~/models/user.server";

import crypto from "crypto";

export function createSixCharacterCode(length = 6) {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(
      Math.floor(crypto.randomInt(characters.length - 1))
    );
  }
  return result;
}

// If we're redirecting to an app route protected by Organization, ensure the organization ID is prepended to that route
const orgProtectedRoutes = ["dashboard", "history", "manageUser"];
export const appendRedirectWithOrgId = (redirect: string, orgId: string) => {
  if (redirect.includes(orgId)) return redirect;
  if (orgProtectedRoutes.find((route) => redirect.includes(route))) {
    return `/${orgId}${redirect}`;
  }
  return redirect;
};

const DEFAULT_REDIRECT = "/dashboard";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect({
  to,
  defaultRedirect = DEFAULT_REDIRECT,
  orgId,
}: {
  to: FormDataEntryValue | string | null | undefined;
  defaultRedirect?: string;
  orgId?: string;
}) {
  if (!to || typeof to !== "string") {
    return orgId
      ? appendRedirectWithOrgId(defaultRedirect, orgId)
      : defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return orgId
      ? appendRedirectWithOrgId(defaultRedirect, orgId)
      : defaultRedirect;
  }

  return orgId ? appendRedirectWithOrgId(to, orgId) : to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function isNumber(number: unknown) {
  if (typeof number !== "number") return false;
  if (isNaN(number)) return false;
  return true;
}

export function isStripeInvoice(invoice: any): invoice is Stripe.Invoice {
  return (
    invoice && typeof invoice === "object" && typeof invoice.id === "string"
  );
}

export function isStripeSubscription(
  subscription: any
): subscription is Stripe.Subscription {
  return (
    subscription &&
    typeof subscription === "object" &&
    typeof subscription.id === "string"
  );
}
