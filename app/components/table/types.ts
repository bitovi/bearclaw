import type { ChipProps } from "@mui/material/Chip";

export const ProcessingStatusChipColor: Record<
  "complete" | "running" | "not started",
  ChipProps["color"]
> = {
  complete: "secondary",
  running: "primary",
  "not started": "primary",
} as const;
