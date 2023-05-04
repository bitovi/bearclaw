import { useMatches, useNavigate } from "@remix-run/react";

import type { ExpandedPrice } from "~/payment.server";
import type { Subscription } from "~/models/subscriptionTypes";
import { SubscriptionStatus } from "~/models/subscriptionTypes";
import { Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import Option from "./option";
import SubscriptionPlanModal from "./subscriptionPlanModal";
import { cancelActiveSubscription } from "~/services/subscriptions/cancelActiveSubscription";

export default function Route() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ExpandedPrice>();
  const { optionResults, organizationSubscription } = useMatches().find(
    (root) => root.pathname === "/subscription"
  )?.data as {
    optionResults: {
      subscriptionOptions: ExpandedPrice[] | undefined;
      error: string | undefined;
    };
    organizationSubscription: Subscription | null;
  };
  const navigate = useNavigate();

  const userHasPlan = useMemo(() => {
    return (
      organizationSubscription?.activeStatus === SubscriptionStatus.ACTIVE &&
      selectedOption?.product.name ===
        organizationSubscription.subscriptionLevel
    );
  }, [organizationSubscription, selectedOption]);

  const primaryModalAction = useCallback(
    async (id: string) => {
      if (userHasPlan) {
        await cancelActiveSubscription(organizationSubscription?.id);
        setModalOpen(false);
        navigate("/subscription/manage");
      } else {
        navigate(`/subscription/form/${id}`);
      }
    },
    [userHasPlan, navigate, organizationSubscription?.id]
  );

  if (optionResults.error) {
    return <Box>{optionResults.error}</Box>;
  }

  return (
    <>
      <SubscriptionPlanModal
        subscriptionPlanOption={selectedOption}
        secondaryAction={() => setModalOpen(false)}
        primaryAction={primaryModalAction}
        open={modalOpen}
        currentSubscription={{
          status: organizationSubscription?.activeStatus as
            | SubscriptionStatus
            | undefined,
          name: organizationSubscription?.subscriptionLevel,
        }}
      />
      <Box
        minHeight={400}
        display="flex"
        width="full"
        justifyContent="space-between"
      >
        {optionResults.subscriptionOptions?.map((opt) => {
          return (
            <Option
              handleClick={(opt: ExpandedPrice) => {
                setSelectedOption(opt);
                setModalOpen(true);
              }}
              key={opt.id}
              subscriptionPlanOption={opt}
              selected={
                opt.product.name === organizationSubscription?.subscriptionLevel
              }
              cancellationDate={
                opt.product.name === organizationSubscription?.subscriptionLevel
                  ? organizationSubscription.cancellationDate || undefined
                  : undefined
              }
            />
          );
        })}
      </Box>
    </>
  );
}
