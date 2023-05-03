import { Box, Button, Dialog, Typography } from "@mui/material";
import { useMemo } from "react";
import { SubscriptionStatus } from "~/models/subscriptionTypes";
import type { ExpandedPrice } from "~/payment.server";

export default function SubscriptionPlanModal({
  subscriptionPlanOption,
  open,
  currentSubscription,
  secondaryAction,
  primaryAction,
}: {
  subscriptionPlanOption: ExpandedPrice | undefined;
  open: boolean;
  currentSubscription: {
    status: SubscriptionStatus | undefined;
    name: string | undefined;
  };
  secondaryAction: () => void;
  primaryAction: (id: string) => void;
}) {
  const userHasPlan = useMemo(() => {
    return currentSubscription.status === SubscriptionStatus.ACTIVE;
  }, [currentSubscription]);

  const modalTitleText = useMemo(() => {
    return userHasPlan ? "Change Plan" : "Choose Plan";
  }, [userHasPlan]);

  const modalActionText = useMemo(() => {
    return userHasPlan
      ? currentSubscription.name === subscriptionPlanOption?.product.name
        ? "Cancel"
        : "Update"
      : "Subscribe";
  }, [userHasPlan, currentSubscription.name, subscriptionPlanOption]);

  if (!subscriptionPlanOption) return null;

  return (
    <Dialog open={open} data-testid="subscription-plan-modal">
      <Box
        minHeight={200}
        minWidth={400}
        boxShadow={2}
        borderRadius={"4px"}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        padding={2}
      >
        <Typography variant="subtitle2">
          {subscriptionPlanOption?.product.name === currentSubscription.name
            ? "Cancel Plan"
            : modalTitleText}
        </Typography>
        <Typography variant="subtitle2" paddingY={2}>
          ${(subscriptionPlanOption?.unit_amount || 0) / 100} per month
        </Typography>
        <Typography>
          Cancel anytime in subscription. Plan automatically renews until
          canceled.
        </Typography>
        <Box position="absolute" bottom="8" right="8">
          <Button onClick={secondaryAction}>Dismiss</Button>
          <Button
            variant="contained"
            onClick={() => primaryAction(subscriptionPlanOption.id)}
          >
            {modalActionText}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
