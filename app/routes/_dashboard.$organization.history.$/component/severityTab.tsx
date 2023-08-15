import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { WarningColors } from "../types";
import type { CveData } from "~/models/rsbomTypes";

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
  rating: Exclude<CveData["rating"], undefined>;
  score: Exclude<CveData["score"], undefined>;
  height: string;
  width: string;
  padding: string;
  borderRadius: string;
  position?: "flex-end" | "flex-start" | "center";
  textVariant?: (typeof textVariantValues)[number];
}

export function SeverityTab({
  rating,
  score,
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
        backgroundColor: WarningColors[score],
      }}
    >
      <Typography variant={textVariant}>{rating}</Typography>
    </Box>
  );
}
