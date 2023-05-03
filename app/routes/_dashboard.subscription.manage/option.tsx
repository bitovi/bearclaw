import { Box, Button } from "@mui/material";
import { useMemo } from "react";
import { ExpandedPrice } from "~/payment.server";

const selectedStyles = {
  textTransform: "uppercase",
  fontWeight: "500",
  fontSize: "12px",
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

export default function Option({
  subscriptionPlanOption,
  selected,
  handleClick,
  cancellationDate = 0,
}: {
  subscriptionPlanOption: ExpandedPrice;
  selected: boolean;
  handleClick: (subscriptionPlanOption: ExpandedPrice) => void;
  cancellationDate: number | undefined;
}) {
  const buttonText = useMemo(() => {
    const dateString = new Date(cancellationDate * 1000 || "");

    return selected
      ? cancellationDate
        ? `Cancels on ${dateString.getDay()}/${dateString.getMonth()}`
        : "Cancel Plan"
      : "Choose Plan";
  }, [selected, cancellationDate]);

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
      <Box minWidth={100}>{subscriptionPlanOption.product.name}</Box>
      <Box position={"absolute"} bottom={40} left={selected ? "unset" : -14}>
        <Button
          variant="contained"
          color="primary"
          sx={selected ? selectedStyles : {}}
          disabled={!!cancellationDate}
          onClick={() => handleClick(subscriptionPlanOption)}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
}
