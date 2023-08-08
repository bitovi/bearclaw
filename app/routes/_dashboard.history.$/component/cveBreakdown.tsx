import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ChartRing } from "./chartRing";
import { useTheme } from "@mui/material/styles";
import DataObjectIcon from "@mui/icons-material/DataObject";
import SourceIcon from "@mui/icons-material/Source";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import { usePageCopy } from "~/routes/_dashboard/copy";
import { TextCopyIcon } from "~/components/textCopyIcon";

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
  return (
    <Stack direction="row" alignItems="center">
      {Icon}
      <Stack paddingX={1}>
        <Typography variant="body2" margin={0}>
          {title}
        </Typography>
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
      {copy && (
        <TextCopyIcon
          copyValue={details}
          iconProps={{ fontSize: "small" }}
          buttonProps={{ sx: { color: "#FFF" } }}
        />
      )}
    </Stack>
  );
};

type CVEMetaData = {
  totalVulnerabilitiesCaptured: number;
  numberofCriticalWarnings: number;
  numberofHighWarnings: number;
  numberofMedWarnings: number;
  numberofLowWarnings: number;
};

interface CVEBreakdownProps {
  id: string | undefined;
  type: string | undefined;
  date: string | undefined;
  metadata?: CVEMetaData | null;
}

export function CVEBreakdown({ id, type, date, metadata }: CVEBreakdownProps) {
  const copy = usePageCopy("detail");
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      height={{ xs: "732px", lg: "256px" }}
      gap={6}
      color="#FFF"
      sx={{
        backgroundColor: "grey.900",
        padding: 3,
        borderRadius: 3,
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        gap={3}
        alignItems={{ xs: "unset", lg: "center" }}
      >
        <Box
          minWidth={{ xs: "176px", lg: "unset" }}
          minHeight={{ xs: "220px", lg: "unset" }}
        >
          <ChartRing
            data={[
              {
                name: "Critical",
                value: metadata?.numberofCriticalWarnings || 1,
                color: theme.palette.red[800],
              },
              {
                name: "High",
                value: metadata?.numberofHighWarnings || 2,
                color: theme.palette.red[600],
              },
              {
                name: "Medium",
                value: metadata?.numberofMedWarnings || 1,
                color: theme.palette.orange[800],
              },
              {
                name: "Low",
                value: metadata?.numberofLowWarnings || 3,
                color: theme.palette.purple[600],
              },
            ]}
          >
            <Typography color="white" variant="h3">
              {metadata?.totalVulnerabilitiesCaptured || "N/A"}
            </Typography>
            <Typography color="white">CVEs</Typography>
          </ChartRing>
        </Box>

        <Stack gap={2} sx={{ width: "33%" }} flex={1}>
          <BreakdownEntry
            title={`${
              metadata?.numberofCriticalWarnings === 0 ||
              !!metadata?.numberofCriticalWarnings
                ? metadata?.numberofCriticalWarnings
                : "N/A"
            } ${copy?.content?.criticalSeverityCVE} ${copy?.content?.cve}`}
            details={`0 ${copy?.content?.vulnerableSubComponents}`}
            Icon={
              <CircleTwoToneIcon sx={{ color: "red.800" }} fontSize="small" />
            }
          />

          <BreakdownEntry
            title={`${
              metadata?.numberofHighWarnings === 0 ||
              !!metadata?.numberofHighWarnings
                ? metadata?.numberofHighWarnings
                : "N/A"
            } ${copy?.content?.highSeverityCVE} ${copy?.content?.cve}`}
            details={`0 ${copy?.content?.vulnerableSubComponents}`}
            Icon={
              <CircleTwoToneIcon sx={{ color: "red.600" }} fontSize="small" />
            }
          />

          <BreakdownEntry
            title={`${
              metadata?.numberofMedWarnings === 0 ||
              !!metadata?.numberofMedWarnings
                ? metadata?.numberofMedWarnings
                : "N/A"
            } ${copy?.content?.mediumSeverityCVE} ${copy?.content?.cve}`}
            details={`0 ${copy?.content?.vulnerableSubComponents}`}
            Icon={
              <CircleTwoToneIcon
                sx={{ color: "orange.800" }}
                fontSize="small"
              />
            }
          />

          <BreakdownEntry
            title={`${
              metadata?.numberofLowWarnings === 0 ||
              !!metadata?.numberofLowWarnings
                ? metadata?.numberofLowWarnings
                : "N/A"
            } ${copy?.content?.lowSeverityCVE} ${copy?.content?.cve}`}
            details={`0 ${copy?.content?.vulnerableSubComponents}`}
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
