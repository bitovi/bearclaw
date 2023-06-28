import { Box, Stack, ToggleButton, Typography } from "@mui/material";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import { CVECard } from "./cveCard";
import { useState } from "react";

interface CveTableProps {
  cveData: any[];
  orientation: "column" | "row";
  handleRowClick: (id: string) => void;
}

export function CVETable({
  cveData,
  orientation: _orienation = "row",
  handleRowClick = () => {},
}: CveTableProps) {
  const [orientation, setOrientation] = useState<"row" | "column">(_orienation);

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
    <Box>
      <Stack position="relative">
        <Typography variant="h6" color="text.primary">
          CVE List
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select and pin desired CVEs for quick reference.
        </Typography>
        <Box position="absolute" bottom={0} right={0}>
          <ToggleButtonGroup
            value={orientation}
            onChange={handleToggle}
            exclusive
          >
            <ToggleButton value="row" aria-label="View CVE List">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="column" aria-label="View CVE Grid">
              <GridViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>
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
              name={cve.name}
              rating={cve.rating}
              subcomponentCount={cve.subcomponent.length}
              date={cve.date}
              description={cve.description}
              orientation={orientation}
              onRowClick={handleRowClick}
            />
          );
        })}
      </Box>
    </Box>
  );
}
