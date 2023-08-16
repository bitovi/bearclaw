import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconFromString } from "~/components/iconFromString/IconFromString";
import { Button } from "~/components/button";
import { MetricCard } from "./MetricCard";
import { Ellipse } from "./Ellipse.svg";
import background from "./background.png";

export function KeyMetrics({
  totalFilesAnalyzed,
  totalVulnerabilitiesCaptured,
  numberofCriticalWarnings,
}: {
  totalFilesAnalyzed?: number;
  totalVulnerabilitiesCaptured?: number;
  numberofCriticalWarnings?: number;
}) {
  return (
    <Box
      display="grid"
      gap="1rem"
      justifyContent="stretch"
      gridTemplateColumns={{
        xs: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
    >
      {/* TODO: Add proper sorting params to links */}
      <MetricCard
        variant="files"
        count={totalFilesAnalyzed}
        message="Total files analyzed"
      />
      <MetricCard
        variant="vulnerabilities"
        count={totalVulnerabilitiesCaptured}
        message="Total vulnerabilities captured"
      />
      <MetricCard
        variant="cves"
        count={numberofCriticalWarnings}
        message="CVEs with critical scores"
      />
      <Box
        minWidth="22.5rem"
        display="flex"
        gap={1}
        padding="1rem"
        justifyContent="center"
        alignItems="flex-start"
        alignSelf="stretch"
        borderRadius="20px"
        color="white"
        sx={{
          background:
            "linear-gradient(189deg, rgba(51, 51, 51, 0.80) 0%, rgba(0, 0, 0, 0.80) 72.94%), lightgray 50% / cover no-repeat",
        }}
        position="relative"
        overflow="hidden"
      >
        <Box
          component="img"
          src={background}
          position="absolute"
          top="0"
          left="0"
          height="100%"
          width="100%"
          sx={{ objectFit: "cover", opacity: 0.5, mixBlendMode: "overlay" }}
        />
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" fontSize="2rem" alignItems="center" gap="0.5rem">
            <IconFromString icon="addChartTwoTone" />
            <Typography variant="h5">Workflows</Typography>
          </Box>
          <Typography variant="subtitle2">
            Click below to view the workflow.
          </Typography>
          <Box display="flex" gap="1rem">
            <Button size="small" variant="whiteOutlined">
              View
            </Button>
          </Box>
        </Box>
        <Box flex="1" display="flex" justifyContent="center" paddingTop={1}>
          <Ellipse number={1} />
        </Box>
      </Box>
    </Box>
  );
}
