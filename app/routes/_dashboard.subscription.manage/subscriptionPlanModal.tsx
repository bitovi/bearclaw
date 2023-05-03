import { Box, Button, Dialog, Typography } from "@mui/material";
import { useMemo } from "react";
import { SubscriptionStatus } from "~/models/subscriptionTypes";
import type { ExpandedPrice } from "~/payment.server";

export default function SubscriptionPlanModal({
  opt,
  open,
  currentSubscription,
  secondaryAction,
  primaryAction,
}: {
  opt: ExpandedPrice | undefined;
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
      ? currentSubscription.name === opt?.product.name
        ? "Cancel Plan"
        : "Update Plan"
      : "Subscribe";
  }, [userHasPlan, currentSubscription.name, opt]);

  if (!opt) return null;

  return (
    <Dialog open={open} data-testid="subscription-plan-modal">
      <Box
        minHeight={200}
        minWidth={400}
        boxShadow={
          "0px 9px 46px 8px rgba(0, 0, 0, 0.12), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 11px 15px -7px rgba(0, 0, 0, 0.2)"
        }
        borderRadius={"4px"}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        padding={2}
      >
        <Typography variant="subtitle2">
          {opt?.product.name === currentSubscription.name
            ? "Cancel Plan"
            : modalTitleText}
        </Typography>
        <Typography variant="subtitle2" paddingY={2}>
          ${(opt?.unit_amount || 0) / 100} per month
        </Typography>
        <Typography>
          Cancel anytime in subscription. Plan automatically renews until
          canceled.
        </Typography>
        <Box position="absolute" bottom="4" right="4">
          <Button onClick={secondaryAction}>Dismiss</Button>
          <Button onClick={() => primaryAction(opt.id)}>
            {modalActionText}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
