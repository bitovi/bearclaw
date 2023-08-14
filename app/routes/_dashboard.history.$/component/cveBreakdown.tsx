import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ChartRing } from "./chartRing";
import { Theme, useTheme } from "@mui/material/styles";
import DataObjectIcon from "@mui/icons-material/DataObject";
import SourceIcon from "@mui/icons-material/Source";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import { usePageCopy } from "~/routes/_dashboard/copy";
import { TextCopyIcon } from "~/components/textCopyIcon";
import { ProcessingStatus } from "../types";

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
  status: "complete" | "running" | "not started" | undefined;
  metadata?: CVEMetaData | null;
}

enum MetaDataLabelEnum {
  numberofCriticalWarnings = "Critical",
  numberofHighWarnings = "High",
  numberofMedWarnings = "Medium",
  numberofLowWarnings = "Low",
}

enum MetaDataColorEnum {
  numberofCriticalWarnings = "#b71c1c",
  numberofHighWarnings = "#E53935",
  numberofMedWarnings = "#EF6C00",
  numberofLowWarnings = "#8E24AA",
}

const isMetaDataKey = (key: any): key is keyof typeof MetaDataLabelEnum => {
  if (key in MetaDataLabelEnum) return true;
  return false;
};

const generateWarningSlices = (
  metadata: CVEMetaData | undefined | null,
  status: CVEBreakdownProps["status"],
  theme: Theme
) => {
  const results = [];
  if (!metadata) {
    return [
      {
        name: "N/A",
        value: 1,
        color: theme.palette.grey[600],
      },
    ];
  }
  if (status === "complete" && !metadata?.totalVulnerabilitiesCaptured) {
    return [
      {
        name: "Passed",
        value: 1,
        color: theme.palette.green[600],
      },
    ];
  }
  for (const key in metadata) {
    if (
      key !== "totalVulnerabilitiesCaptured" &&
      isMetaDataKey(key) &&
      metadata[key]
    ) {
      results.push({
        name: MetaDataLabelEnum[key],
        value: metadata[key],
        color: MetaDataColorEnum[key],
      });
    }
  }
  return results;
};

export function CVEBreakdown({
  id,
  type,
  date,
  metadata,
  status,
}: CVEBreakdownProps) {
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
            data={generateWarningSlices(metadata, status, theme) || []}
          >
            {status === ProcessingStatus.COMPLETE &&
            !metadata?.totalVulnerabilitiesCaptured ? (
              <Typography color="white" variant="h3">
                {copy?.content?.passed || "Passed"}
              </Typography>
            ) : (
              <>
                <Typography color="white" variant="h3">
                  {metadata?.totalVulnerabilitiesCaptured || "N/A"}
                </Typography>
                <Typography color="white">
                  {copy?.content?.cves || "CVEs"}
                </Typography>
              </>
            )}
          </ChartRing>
        </Box>

        <Stack gap={2} sx={{ width: "33%" }} flex={1}>
          <BreakdownEntry
            title={`${
              metadata?.numberofCriticalWarnings === 0 ||
              !!metadata?.numberofCriticalWarnings
                ? metadata?.numberofCriticalWarnings
                : copy?.content?.notApplicable || "N/A"
            } ${copy?.content?.criticalSeverityCVE} ${copy?.content?.cve}`}
            details={`0 ${
              copy?.content?.vulnerableSubComponents ||
              "vulnerable subcomponents"
            }`}
            Icon={
              <CircleTwoToneIcon sx={{ color: "red.800" }} fontSize="small" />
            }
          />

          <BreakdownEntry
            title={`${
              metadata?.numberofHighWarnings === 0 ||
              !!metadata?.numberofHighWarnings
                ? metadata?.numberofHighWarnings
                : copy?.content?.notApplicable || "N/A"
            } ${copy?.content?.highSeverityCVE} ${copy?.content?.cve}`}
            details={`0 ${
              copy?.content?.vulnerableSubComponents ||
              "vulnerable subcomponents"
            }`}
            Icon={
              <CircleTwoToneIcon sx={{ color: "red.600" }} fontSize="small" />
            }
          />

          <BreakdownEntry
            title={`${
              metadata?.numberofMedWarnings === 0 ||
              !!metadata?.numberofMedWarnings
                ? metadata?.numberofMedWarnings
                : copy?.content?.notApplicable || "N/A"
            } ${copy?.content?.mediumSeverityCVE} ${copy?.content?.cve}`}
            details={`0 ${
              copy?.content?.vulnerableSubComponents ||
              "vulnerable subcomponents"
            }`}
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
                : copy?.content?.notApplicable || "N/A"
            } ${copy?.content?.lowSeverityCVE} ${copy?.content?.cve}`}
            details={`0 ${
              copy?.content?.vulnerableSubComponents ||
              "vulnerable subcomponents"
            }`}
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
