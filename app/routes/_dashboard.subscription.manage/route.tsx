import { useMatches, useNavigate } from "@remix-run/react";

import type { ExpandedPrice } from "~/payment.server";
import type { Subscription } from "~/models/subscriptionTypes";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import Option from "./option";
import SubscriptionPlanModal, { ModalAction } from "./subscriptionPlanModal";
import { cancelActiveSubscription } from "~/services/subscriptions/cancelActiveSubscription";
import { updateActiveSubscription } from "~/services/subscriptions/updateSubscription";

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

  const primaryModalAction = useCallback(
    async ({
      action,
      planId,
      subId,
      invoiceTimeStamp,
    }: {
      action: ModalAction;
      planId: string;
      subId?: string;
      invoiceTimeStamp?: number;
    }) => {
      switch (action) {
        case ModalAction.SUBSCRIBE:
          navigate(`/subscription/form/${planId}`);
          return;
        case ModalAction.UPDATE:
          await updateActiveSubscription(subId, planId, invoiceTimeStamp);
          setModalOpen(false);
          navigate("/subscription/manage");
          return;
        case ModalAction.CANCEL:
          await cancelActiveSubscription(subId);
          setModalOpen(false);
          navigate("/subscription/manage");
          return;
      }
    },
    [navigate]
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedOption(undefined);
  }, []);

  if (optionResults.error) {
    return <Box>{optionResults.error}</Box>;
  }
  return (
    <>
      <SubscriptionPlanModal
        subscriptionPlanOption={selectedOption}
        primaryAction={primaryModalAction}
        secondaryAction={closeModal}
        open={modalOpen}
        currentSubscription={organizationSubscription}
        onClose={closeModal}
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
