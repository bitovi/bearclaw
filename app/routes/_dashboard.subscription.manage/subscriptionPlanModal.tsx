import { Box, Button, Dialog, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loading } from "~/components/loading/Loading";
import { SubscriptionStatus } from "~/models/subscriptionTypes";
import type { InvoicePreview, Subscription } from "~/models/subscriptionTypes";
import type { ExpandedPrice } from "~/payment.server";
import { previewSubscriptionUpdate } from "~/services/subscriptions/updateSubscription";

export enum ModalAction {
  UPDATE = "Update",
  CANCEL = "Cancel",
  SUBSCRIBE = "Subscribe",
}

enum ModalTitle {
  UPDATE_PLAN = "Change Plan",
  CANCEL_PLAN = "Cancel Plan",
  CHOOSE_PLAN = "Choose Plan",
}

const UpdateInformationBox = ({
  subId,
  planId,
  handleInvoicePreviewTimeStamp,
}: {
  subId: string;
  planId: string;
  handleInvoicePreviewTimeStamp: (invoiceTimeStamp: number | undefined) => void;
}) => {
  const [invoicePreview, setInvoicePreview] = useState<InvoicePreview>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    const fetchSubcription = async () => {
      return await previewSubscriptionUpdate(subId, planId);
    };

    if (planId && subId) {
      setLoading(true);
      fetchSubcription()
        .then((result) => {
          if ("error" in result) {
            console.error(result.error);
            setError("Something went wrong previewing this invoice");
          }
          if ("data" in result) {
            setInvoicePreview(result.data);
            handleInvoicePreviewTimeStamp(result.data.prorationDate);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [planId, subId, handleInvoicePreviewTimeStamp]);

  return (
    <Box>
      {loading && <Loading />}
      {error && <Box>{error}</Box>}
      {!loading && !error && invoicePreview && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          paddingY={1}
        >
          <Typography>
            By changing to this plan, you will be billed $
            {invoicePreview.upcomingToBeBilled / 100} for the upcoming billing
            cycle beginning on{" "}
            {dayjs(new Date(invoicePreview.periodEnd * 1000))
              .add(1, "day")
              .format("MMMM DD, YYYY")}
            . This amount reflects proration for any remaining days left in the
            current billing cycle.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default function SubscriptionPlanModal({
  subscriptionPlanOption,
  open,
  currentSubscription,
  primaryAction,
  secondaryAction,
  onClose,
}: {
  subscriptionPlanOption: ExpandedPrice | undefined;
  open: boolean;
  currentSubscription: Subscription | null;
  primaryAction: ({
    action,
    planId,
    subId,
    invoiceTimeStamp,
  }: {
    action: ModalAction;
    planId: string;
    subId?: string;
    invoiceTimeStamp?: number;
  }) => void;
  secondaryAction: () => void;
  onClose: () => void;
}) {
  const [invoiceTimeStamp, setInvoiceTimeStamp] = useState<number>();

  const userHasPlan = useMemo(() => {
    return currentSubscription?.activeStatus === SubscriptionStatus.ACTIVE;
  }, [currentSubscription]);

  const modalTitle = useMemo(() => {
    return userHasPlan
      ? subscriptionPlanOption?.product.name ===
        currentSubscription?.subscriptionLevel
        ? ModalTitle.CANCEL_PLAN
        : ModalTitle.UPDATE_PLAN
      : ModalTitle.CHOOSE_PLAN;
  }, [userHasPlan, subscriptionPlanOption, currentSubscription]);

  const modalAction = useMemo(() => {
    return userHasPlan
      ? currentSubscription?.subscriptionLevel ===
        subscriptionPlanOption?.product.name
        ? ModalAction.CANCEL
        : ModalAction.UPDATE
      : ModalAction.SUBSCRIBE;
  }, [
    userHasPlan,
    currentSubscription?.subscriptionLevel,
    subscriptionPlanOption,
  ]);

  const handleInvoicePreviewTimeStamp = useCallback(
    (timeStamp: number | undefined) => {
      setInvoiceTimeStamp(timeStamp);
    },
    []
  );

  if (!subscriptionPlanOption) return null;

  return (
    <Dialog onClose={onClose} open={open} data-testid="subscription-plan-modal">
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
        <Typography variant="subtitle2">{modalTitle}</Typography>
        <Typography variant="subtitle2" paddingY={2}>
          {subscriptionPlanOption.product.name} - $
          {(subscriptionPlanOption?.unit_amount || 0) / 100} per month
        </Typography>

        {modalAction === ModalAction.UPDATE && currentSubscription && (
          <UpdateInformationBox
            subId={currentSubscription?.id}
            planId={subscriptionPlanOption.id}
            handleInvoicePreviewTimeStamp={handleInvoicePreviewTimeStamp}
          />
        )}

        <Box paddingTop={2} paddingBottom={6}>
          <Typography>
            Cancel anytime in subscription. Plan automatically renews until
            canceled.
          </Typography>
        </Box>

        <Box position="absolute" bottom="8" right="8">
          <Button onClick={secondaryAction}>Dismiss</Button>
          <Button
            variant="contained"
            onClick={() =>
              primaryAction({
                action: modalAction,
                planId: subscriptionPlanOption.id,
                subId: currentSubscription?.id,
                invoiceTimeStamp,
              })
            }
          >
            {modalAction}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
