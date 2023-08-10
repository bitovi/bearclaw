import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import { CVECard, SkeletonCard } from "./cveCard";
import { useState } from "react";
import type { CveData } from "~/models/rsbomTypes";
import { usePageCopy } from "~/routes/_dashboard/copy";
import { ProcessingStatus } from "../types";
import { CveStatusImage } from "./cveStatusImage";
import Skeleton from "@mui/material/Skeleton";

interface CveTableProps {
  cveData: CveData[] | undefined;
  orientation: "column" | "row";
  handleRowClick: (id: string) => void;
  processingStatus?: "running" | "complete" | "not started";
}

export function CVETableSkeleton() {
  return (
    <Box paddingY={4}>
      <Stack position="relative">
        <Typography variant="h6">
          <Skeleton variant="text" animation="wave" width="300px" />
        </Typography>
        <Typography variant="body2">
          <Skeleton variant="text" animation="wave" width="450px" />
        </Typography>
      </Stack>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr" }}
        gap={2}
        paddingTop={2}
      >
        {Array(3)
          .fill("")
          .map((_, row) => {
            return <SkeletonCard key={row} />;
          })}
      </Box>
    </Box>
  );
}

export function CVETable({
  cveData,
  orientation: _orienation = "row",
  handleRowClick = () => {},
  processingStatus,
}: CveTableProps) {
  const [orientation, setOrientation] = useState<"row" | "column">(_orienation);
  const copy = usePageCopy("detail");

  const handleToggle = (
    _e: React.MouseEvent<HTMLElement, MouseEvent>,
    value: "column" | "row"
  ) => {
    setOrientation(value);
  };

  const gridTemplate =
    orientation === "column"
      ? {
          xs: "1fr",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }
      : { xs: "1fr" };

  return (
    <Box paddingY={4}>
      <Stack position="relative">
        <Typography variant="h6" color="text.primary">
          {copy?.content?.cveTableHeader || "CVEs Found at This Level"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {copy?.content?.cveTableSubheader ||
            "Pin desired CVEs for quick refrence. This only works on the current level you are viewing."}
        </Typography>
        <Box
          paddingTop={{ xs: 2, md: "unset" }}
          position={{ xs: "unset", md: "absolute" }}
          bottom={0}
          right={0}
        >
          <ToggleButtonGroup
            value={orientation}
            onChange={handleToggle}
            exclusive
          >
            <ToggleButton
              value="row"
              aria-label="View CVE List"
              disabled={orientation === "row"}
            >
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton
              value="column"
              aria-label="View CVE Grid"
              disabled={orientation === "column"}
            >
              <GridViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>
      {processingStatus === ProcessingStatus.COMPLETE ? (
        cveData?.length ? (
          <Box
            display="grid"
            gridTemplateColumns={gridTemplate}
            gap={2}
            paddingTop={2}
          >
            {cveData.map((cve, i) => {
              return (
                <CVECard
                  key={`${cve.name}-${i}`}
                  name={
                    cve.name ||
                    copy?.content?.cveTitleNotFound ||
                    "CVE Name Not Found"
                  }
                  rating={cve.rating}
                  score={cve.score}
                  subcomponentCount={cve.subcomponents?.length}
                  date={cve.date}
                  description={cve.description}
                  orientation={orientation}
                  onRowClick={handleRowClick}
                />
              );
            })}
          </Box>
        ) : (
          <CveStatusImage
            image={copy?.images?.processingResults}
            displayText={copy?.content?.noCVEsFound || "No CVEs found."}
          />
        )
      ) : (
        <CveStatusImage
          image={copy?.images?.processingResults}
          displayText={
            copy?.content?.analyzing || "Data is still being analyzed."
          }
        />
      )}
    </Box>
  );
}
