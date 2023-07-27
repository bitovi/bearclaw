import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ChartRing } from "./chartRing";
import { useTheme } from "@mui/material/styles";
import DataObjectIcon from "@mui/icons-material/DataObject";
import SourceIcon from "@mui/icons-material/Source";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import { useTextCopy } from "~/hooks/useTextCopy";
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
  metadata: CVEMetaData;
}

export function CVEBreakdown({ id, type, date, metadata }: CVEBreakdownProps) {
  const copy = usePageCopy("detail");
  const theme = useTheme();

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
      <Stack direction="row" gap={3} alignItems="center">
        <Box>
          <ChartRing
            data={[
              {
                name: "Critical",
                value: metadata.numberofCriticalWarnings,
                color: theme.palette.red[800],
              },
              {
                name: "High",
                value: metadata.numberofHighWarnings,
                color: theme.palette.red[600],
              },
              {
                name: "Medium",
                value: metadata.numberofMedWarnings,
                color: theme.palette.orange[800],
              },
              {
                name: "Low",
                value: metadata.numberofLowWarnings,
                color: theme.palette.purple[600],
              },
            ]}
          >
            <Typography color="white" variant="h3">
              {metadata.numberofCriticalWarnings +
                metadata.numberofHighWarnings +
                metadata.numberofMedWarnings +
                metadata.numberofLowWarnings}
            </Typography>
            <Typography color="white">CVEs</Typography>
          </ChartRing>
        </Box>
        {!!metadata.totalVulnerabilitiesCaptured && (
          <Stack gap={2} sx={{ width: "33%" }} flex={1}>
            {!!metadata.numberofCriticalWarnings && (
              <BreakdownEntry
                title={`${metadata.numberofCriticalWarnings} ${copy?.content?.criticalSeverityCVE} ${copy?.content?.cve}`}
                details={`0 ${copy?.content?.vulnerableSubComponents}`}
                Icon={
                  <CircleTwoToneIcon
                    sx={{ color: "red.800" }}
                    fontSize="small"
                  />
                }
              />
            )}
            {!!metadata.numberofHighWarnings && (
              <BreakdownEntry
                title={`${metadata.numberofHighWarnings} ${copy?.content?.highSeverityCVE} ${copy?.content?.cve}`}
                details={`0 ${copy?.content?.vulnerableSubComponents}`}
                Icon={
                  <CircleTwoToneIcon
                    sx={{ color: "red.600" }}
                    fontSize="small"
                  />
                }
              />
            )}
            {!!metadata.numberofMedWarnings && (
              <BreakdownEntry
                title={`${metadata.numberofMedWarnings} ${copy?.content?.mediumSeverityCVE} ${copy?.content?.cve}`}
                details={`0 ${copy?.content?.vulnerableSubComponents}`}
                Icon={
                  <CircleTwoToneIcon
                    sx={{ color: "orange.800" }}
                    fontSize="small"
                  />
                }
              />
            )}
            {!!metadata.numberofLowWarnings && (
              <BreakdownEntry
                title={`${metadata.numberofLowWarnings} ${copy?.content?.lowSeverityCVE} ${copy?.content?.cve}`}
                details={`0 ${copy?.content?.vulnerableSubComponents}`}
                Icon={
                  <CircleTwoToneIcon
                    sx={{ color: "purple.600" }}
                    fontSize="small"
                  />
                }
              />
            )}
          </Stack>
        )}
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
