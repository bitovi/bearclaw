import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Button } from "~/components/button";
import { useLoaderData, useMatches, useNavigate } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";
import type { Subscription } from "@prisma/client";
import type { ExpandedPrice, InvoicePreview } from "~/models/subscriptionTypes";
import { json, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import SubscriptionPlanModal from "./components/subscriptionPlanModal";
import dayjs from "dayjs";
import FeatureBox from "./components/featureBox";
import { Banner } from "~/components/banner";

const featuresFixture = [
  "Suscipit lacus elit lobortis ultrices a diam. Diam eu est vel mollis ut. At mi id morbi blandit pharetra in neque. Enim adipiscing dui sed urna at vivamus. Nisl nisl id vitae non sed. Risus ut viverra nulla urna posuere varius.",
  "Suscipit lacus elit lobortis ultrices a diam. Diam eu est vel mollis ut. At mi id morbi blandit pharetra in neque. Enim adipiscing dui sed urna at vivamus. Nisl nisl id vitae non sed. Risus ut viverra nulla urna posuere varius.",
  "Suscipit lacus elit lobortis ultrices a diam. Diam eu est vel mollis ut. At mi id morbi blandit pharetra in neque. Enim adipiscing dui sed urna at vivamus. Nisl nisl id vitae non sed. Risus ut viverra nulla urna posuere varius.",
];

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const priceId = url.searchParams.get("subscription");
  const error = url.searchParams.get("error");

  if (!priceId) {
    console.error("No subscription Price ID found");
    return redirect("/subscription");
  }
  return json({ priceId, error });
}

export default function Route() {
  const { error } = useLoaderData<typeof loader>();
  const [modalOpen, setModalOpen] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(!!error);
  const { priceId } = useLoaderData<typeof loader>();
  const { optionResults, organizationSubscription } = useMatches().find(
    (root) => root.pathname === "/subscription"
  )?.data as {
    optionResults: {
      subscriptionOptions: ExpandedPrice[] | undefined;
      error: string | undefined;
    } | null;
    organizationSubscription: Subscription | null;
    invoicePreview: InvoicePreview | null;
  };
  const navigate = useNavigate();

  const subscriptionOption = useMemo(() => {
    return optionResults?.subscriptionOptions?.find(
      (opt) => opt.id === priceId
    );
  }, [optionResults, priceId]);

  const handleBackNavigation = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const primaryButtonText = useMemo(() => {
    return organizationSubscription
      ? subscriptionOption?.product.name ===
        organizationSubscription?.subscriptionLevel
        ? organizationSubscription?.cancellationDate
          ? `Canceling on ${dayjs(
            new Date(organizationSubscription?.cancellationDate * 1000)
          ).format("MMMM DD, YYYY")}`
          : "cancel plan"
        : "update plan"
      : "subscribe to plan";
  }, [organizationSubscription, subscriptionOption]);

  if (!subscriptionOption) {
    navigate(-1);
  }
  return (
    <>
      <SubscriptionPlanModal
        subscriptionPlanOption={subscriptionOption}
        secondaryAction={closeModal}
        open={modalOpen}
        currentSubscription={organizationSubscription}
        onClose={closeModal}
      />
      <Container>
        <Stack alignItems="center" marginTop="44px" paddingBottom={2}>
          <Skeleton
            animation={false}
            variant="rectangular"
            width="100px"
            height="100px"
            sx={{ display: "flex" }}
            component={Box}
            justifyContent={"center"}
            alignItems="center"
            borderRadius="32px"
          >
            <Typography component="span" visibility={"visible"}>
              Graphic
            </Typography>
          </Skeleton>
          <Stack alignItems="center">
            <Typography variant="h4" color="text.primary">
              Get {subscriptionOption?.product.name} for
            </Typography>
            <Typography variant="h3" color="text.primary">
              ${(subscriptionOption?.unit_amount || 0) / 100}
            </Typography>
            <Typography variant="body2" color="text.primary">
              Per month
            </Typography>
          </Stack>
        </Stack>
        <Stack overflow="scroll" maxHeight="450px">
          {featuresFixture.map((des, i) => {
            return (
              <FeatureBox
                key={`${des.slice(0, 4)}-${i}`}
                description={des}
                number={i + 1}
              />
            );
          })}
        </Stack>
        <Stack paddingTop={3}>
          <Button
            onClick={() => setModalOpen(true)}
            disabled={
              subscriptionOption?.product.name ===
                organizationSubscription?.subscriptionLevel
                ? !!organizationSubscription?.cancellationDate || false
                : false
            }
            variant="buttonLarge"
            sx={{ color: "primary.contrast" }}
          >
            {primaryButtonText}
          </Button>
          <Button
            variant="buttonMedium"
            onClick={handleBackNavigation}
            sx={{
              "&:hover": { backgroundColor: "#FFF" },
              color: "primary.main",
            }}
          >
            <KeyboardArrowLeftIcon />
            Go back
          </Button>
        </Stack>
        <Banner
          container={{
            open: subscriptionError,
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
          }}
          title="A problem occurred setting up the subscription"
          alert={{
            severity: "error",
            variant: "filled",
            onClose: () => setSubscriptionError(false),
          }}
        >
          <Typography>
            Please contact customer support to resolve this issue.
          </Typography>
        </Banner>
      </Container>
    </>
  );
}
