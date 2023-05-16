import { SubscriptionStatus } from "~/models/subscriptionTypes";

export const badSubscriptionStatus = (status: string) => {
  if (
    status === SubscriptionStatus.ACTIVE ||
    status === SubscriptionStatus.CANCELED
  ) {
    return false;
  } else {
    return true;
  }
};
