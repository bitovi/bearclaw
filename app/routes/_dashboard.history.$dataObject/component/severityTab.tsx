import { Box, Typography } from "@mui/material";
import { WarningColors } from "../types";
import { rateSeverity } from "../utils/rateSeverity";

interface SeverityTabProps {
  rating: string;
  height: string;
  width: string;
  padding: string;
  borderRadius: string;
  position?: "flex-end" | "flex-start" | "center";
}

export function SeverityTab({
  rating,
  height,
  width,
  padding,
  borderRadius,
  position = "center",
}: SeverityTabProps) {
  return (
    <Box
      display="flex"
      alignItems={position}
      height={height}
      width={width}
      borderRadius={borderRadius}
      padding={padding}
      color="#FFF"
      sx={{
        backgroundColor: WarningColors[rateSeverity(rating)],
      }}
    >
      <Typography variant="h4">{rating}</Typography>
    </Box>
  );
}
