import { useMatches, useNavigate } from "@remix-run/react";

import type { ExpandedPrice } from "~/payment.server";
import type {
  Subscription,
  SubscriptionStatus,
} from "~/models/subscriptionTypes";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import SubscriptionPlanModal from "./subscriptionPlanModal";

const selectedStyles = {
  textTransform: "uppercase",
  fontWeight: "500",
  fontSize: "14px",
  lineHeight: "24px",
  paddingY: "6px",
  paddingX: "16px",
  borderRadius: "4px",
  backgroundColor: "transparent",
  color: "#2196F3",
  border: "1px solid",
  borderColor: "#2196F3",
  boxShadow: "unset",
};

const Option = ({
  opt,
  selected,
  handleClick,
}: {
  opt: ExpandedPrice;
  selected: boolean;
  handleClick: (opt: ExpandedPrice) => void;
}) => {
  return (
    <Box
      alignSelf={"stretch"}
      display="flex"
      flexDirection={"column"}
      flexGrow={1}
      marginX={1}
      bgcolor={"#EEEEEE"}
      borderRadius={"32px"}
      border={"1px solid"}
      borderColor={"#2196F3"}
      alignItems={"center"}
      justifyContent={"center"}
      position="relative"
    >
      <Box minWidth={100}>{opt.product.name}</Box>
      <Box position={"absolute"} bottom={40} left={selected ? "unset" : -14}>
        <Button
          variant="contained"
          color="primary"
          sx={selected ? selectedStyles : {}}
          onClick={() => handleClick(opt)}
        >
          {selected ? "Cancel Plan" : "Choose Plan"}
        </Button>
      </Box>
    </Box>
  );
};

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

  if (optionResults.error) {
    return <Box>{optionResults.error}</Box>;
  }
  return (
    <>
      <SubscriptionPlanModal
        opt={selectedOption}
        secondaryAction={() => setModalOpen(false)}
        primaryAction={(id) => {
          navigate(`/subscription/form/${id}`);
        }}
        open={modalOpen}
        currentSubscription={{
          status: organizationSubscription?.active as
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
              opt={opt}
              selected={
                opt.product.name === organizationSubscription?.subscriptionLevel
              }
            />
          );
        })}
      </Box>
    </>
  );
}
