import { Box, Typography } from "@mui/material";
import { WarningColors } from "../types";
import { rateSeverity } from "../utils/rateSeverity";

interface SeverityTabProps {
  rating: string;
}

export function SeverityTab({ rating }: SeverityTabProps) {
  return (
    <Box
      display="flex"
      height="62px"
      borderRadius="0px 0px 28px 0px"
      padding="0px 8px"
      color="#FFF"
      sx={{
        backgroundColor: WarningColors[rateSeverity(rating)],
      }}
    >
      <Typography alignSelf="center">{rating}</Typography>
    </Box>
  );
}
