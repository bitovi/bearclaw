import { retrieveActiveOrganizationUser } from "./models/organizationUsers.server";
import { retrieveSubscriptionByOrgId } from "./models/subscription.server";
import { getOrgandUserId } from "./session.server";

export async function retrieveOrganizationSubscription(request: Request) {
  const { organizationId, userId } = await getOrgandUserId(request);
  const orgUser = await retrieveActiveOrganizationUser({
    organizationId,
    userId,
  });
  if (orgUser?.subscriptionView) {
    const subscription = await retrieveSubscriptionByOrgId(organizationId);
    return subscription;
  }
  return null;
}
