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
import { usePageCopy } from "~/routes/_dashboard/copy";

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

const severityFilter = (vulnerabilties: CveData[], filterText: string) => {
  const totalVulnerabilityCount = vulnerabilties.filter((vul) => {
    if (!vul.rating) return false;
    return rateSeverity(vul.rating) === filterText;
  }).length;

  const totalSubComponentCount = vulnerabilties.reduce((acc, curr) => {
    if (!curr.rating) {
      return acc;
    }
    if (rateSeverity(curr.rating) === filterText) {
      console.log("value", curr);
      return acc + (curr?.subcomponents?.length || 0);
    }
    return acc;
  }, 0);

  return {
    totalVulnerabilityCount,
    totalSubComponentCount,
  };
};

interface CVEBreakdownProps {
  id: string | undefined;
  type: string | undefined;
  date: string | undefined;
  vulnerabilties: CveData[];
}

export function CVEBreakdown({
  id,
  type,
  date,
  vulnerabilties,
}: CVEBreakdownProps) {
  const copy = usePageCopy("detail");

  const highSeverity = useMemo(
    () => severityFilter(vulnerabilties, "highSeverityCVE"),
    [vulnerabilties]
  );
  const mediumSeverity = useMemo(
    () => severityFilter(vulnerabilties, "mediumSeverityCVE"),
    [vulnerabilties]
  );
  const lowSeverity = useMemo(
    () => severityFilter(vulnerabilties, "lowSeverityCVE"),
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
            title={`${highSeverity.totalVulnerabilityCount} ${copy?.content?.highSeverityCVE} ${copy?.content?.cve}`}
            details={`${highSeverity.totalSubComponentCount} ${copy?.content?.vulnerableSubComponents}`}
            Icon={
              <CircleTwoToneIcon sx={{ color: "red.600" }} fontSize="small" />
            }
          />
          <BreakdownEntry
            title={`${mediumSeverity.totalVulnerabilityCount} ${copy?.content?.mediumSeverityCVE} ${copy?.content?.cve}`}
            details={`${mediumSeverity.totalSubComponentCount} ${copy?.content?.vulnerableSubComponents}`}
            Icon={
              <CircleTwoToneIcon
                sx={{ color: "orange.800" }}
                fontSize="small"
              />
            }
          />
          <BreakdownEntry
            title={`${lowSeverity.totalVulnerabilityCount} ${copy?.content?.lowSeverityCVE} ${copy?.content?.cve}`}
            details={`${lowSeverity.totalSubComponentCount} ${copy?.content?.vulnerableSubComponents}`}
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
        {id && (
          <BreakdownEntry
            title={copy?.content?.objectId || "Object ID"}
            details={id}
            Icon={<DataObjectIcon fontSize="small" />}
            copy={true}
          />
        )}
        {type && (
          <BreakdownEntry
            title={copy?.content?.type || "Type"}
            details={type}
            Icon={<SourceIcon fontSize="small" />}
          />
        )}
        {date && (
          <BreakdownEntry
            title={copy?.content?.analysisDate || "Analysis Date"}
            details={date}
            Icon={<CalendarTodayIcon fontSize="small" />}
          />
        )}
      </Stack>
    </Stack>
  );
}
