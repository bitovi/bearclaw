import { Box, Typography } from "@mui/material";
import { WarningColors } from "../types";
import { rateSeverity } from "../utils/rateSeverity";

const textVariantValues = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "subtitle2",
  "body1",
  "body2",
] as const;

interface SeverityTabProps {
  rating: string;
  height: string;
  width: string;
  padding: string;
  borderRadius: string;
  position?: "flex-end" | "flex-start" | "center";
  textVariant?: (typeof textVariantValues)[number];
}

export function SeverityTab({
  rating,
  height,
  width,
  padding,
  borderRadius,
  position = "center",
  textVariant = "body1",
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
      <Typography variant={textVariant}>{rating}</Typography>
    </Box>
  );
}
