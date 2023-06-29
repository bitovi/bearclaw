import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataCircle } from "~/components/dataCircle";

import DataObjectIcon from "@mui/icons-material/DataObject";
import SourceIcon from "@mui/icons-material/Source";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import { useTextCopy } from "~/hooks/useTextCopy";
import type { CveData } from "~/models/rsbomTypes";
import { rateSeverity } from "../utils/rateSeverity";
import { useMemo } from "react";

const BreakdownEntry = ({
  title,
  details,
  Icon,
  copy,
}: {
  title: string;
  details: string;
  Icon: JSX.Element;
  copy?: boolean;
}) => {
  const CopyIcon = useTextCopy({
    copyValue: details,
    iconProps: {
      fontSize: "small",
    },
    buttonProps: {
      sx: {
        color: "#FFF",
      },
    },
  });

  return (
    <Stack direction="row" alignItems="center">
      {Icon}
      <Stack paddingX={1}>
        <Typography variant="body2">{title}</Typography>
        <Typography
          aria-label={details}
          title={details}
          variant="body2"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "250px",
          }}
        >
          {details}
        </Typography>
      </Stack>
      {copy && CopyIcon}
    </Stack>
  );
};

interface CVEBreakdownProps {
  id: string | undefined;
  type: string | undefined;
  date: string;
  vulnerabilties: CveData[];
}

const severityFilter = (vulnerabilties: CveData[], filterText: string) => {
  const totalVulnerabilityCount = vulnerabilties.filter((vul) => {
    return rateSeverity(vul.rating) === filterText;
  }).length;

  const totalSubComponentCount = vulnerabilties.reduce((acc, curr) => {
    if (rateSeverity(curr.rating) === filterText) {
      return acc + (curr?.subcomponent?.length || 0);
    }
    return acc;
  }, 0);

  return {
    totalVulnerabilityCount,
    totalSubComponentCount,
  };
};

export function CVEBreakdown({
  id,
  type,
  date,
  vulnerabilties,
}: CVEBreakdownProps) {
  const highSeverity = useMemo(
    () => severityFilter(vulnerabilties, "HIGH"),
    [vulnerabilties]
  );
  const mediumSeverity = useMemo(
    () => severityFilter(vulnerabilties, "MEDIUM"),
    [vulnerabilties]
  );
  const lowSeverity = useMemo(
    () => severityFilter(vulnerabilties, "LOW"),
    [vulnerabilties]
  );

  return (
    <Stack
      direction="row"
      gap={6}
      color="#FFF"
      sx={{
        backgroundColor: "grey.900",
        padding: 3,
        width: "fit-content",
        borderRadius: 3,
      }}
    >
      <Stack direction="row" gap={3}>
        <Box>
          <DataCircle />
        </Box>
        <Stack gap={2} sx={{ width: "33%" }} flex={1}>
          <BreakdownEntry
            title={`${highSeverity.totalVulnerabilityCount} High Severity CVE`}
            details={`${highSeverity.totalSubComponentCount} vulnerable subcomponents`}
            Icon={
              <CircleTwoToneIcon sx={{ color: "red.600" }} fontSize="small" />
            }
          />
          <BreakdownEntry
            title={`${mediumSeverity.totalVulnerabilityCount} High Severity CVE`}
            details={`${mediumSeverity.totalSubComponentCount} vulnerable subcomponents`}
            Icon={
              <CircleTwoToneIcon
                sx={{ color: "orange.800" }}
                fontSize="small"
              />
            }
          />
          <BreakdownEntry
            title={`${lowSeverity.totalVulnerabilityCount} High Severity CVE`}
            details={`${lowSeverity.totalSubComponentCount} vulnerable subcomponents`}
            Icon={
              <CircleTwoToneIcon
                sx={{ color: "purple.600" }}
                fontSize="small"
              />
            }
          />
        </Stack>
      </Stack>
      <Stack gap={2} sx={{ width: "33%" }}>
        <BreakdownEntry
          title="Object ID"
          details={id || "UNDEFINED"}
          Icon={<DataObjectIcon fontSize="small" />}
          copy={true}
        />
        <BreakdownEntry
          title="Type"
          details={type || "UNDEFINED"}
          Icon={<SourceIcon fontSize="small" />}
        />
        <BreakdownEntry
          title="Analysis Date"
          details={date}
          Icon={<CalendarTodayIcon fontSize="small" />}
        />
      </Stack>
    </Stack>
  );
}
