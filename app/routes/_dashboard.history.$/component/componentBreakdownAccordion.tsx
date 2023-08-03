import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import ChildJobsTable, { SkeletonTable } from "~/components/table";
import NavigateNextSharpIcon from "@mui/icons-material/NavigateNextSharp";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Chip from "@mui/material/Chip";
import { ProcessingStatusChipColor } from "~/components/table/types";
import { toTitleCase } from "~/utils/string/toTitleCase";
import { ProcessingStatus } from "../types";
import type { ApiResponseWrapper } from "~/services/bigBear/utils.server";
import type { ChildJobTransformed } from "~/services/bigBear/getAllChildJobs.server";
import Skeleton from "@mui/material/Skeleton";
import { Suspense, useState } from "react";
import { Await, Link, useLocation } from "@remix-run/react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { CveStatusImage } from "./cveStatusImage";
import { usePageCopy } from "~/routes/_dashboard/copy";

dayjs.extend(utc);

const BreadCrumbSkeletonRow = () => (
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <Skeleton
        key={i}
        component={Chip}
        width="152px"
        height="32px"
        animation="wave"
        variant="text"
      />
    ))}
  </>
);

type BreadCrumbEntry = {
  id: string;
  filename: string;
};

const BreadCrumbRow = ({ entries }: { entries: BreadCrumbEntry[] }) => {
  const { pathname } = useLocation();
  const pagePath = pathname.split("/")[1];
  const entryIds = entries.map((entry) => entry.id);

  return (
    <Breadcrumbs
      sx={{ ariaLabel: "Data Object IDs for navigating to parent files" }}
      separator={<Box />}
    >
      {entries.map((entry, i) => {
        const last = i + 1 === entries.length;
        const breadCrumbPath = entryIds.slice(0, i + 1).join("/");

        return (
          <Chip
            draggable={false}
            sx={{ marginBottom: "8px" }}
            key={entry.id}
            variant={"outlined"}
            color={last ? "primary" : "secondary"}
            label={entry.filename}
            prefetch="render"
            component={last ? Box : Link}
            to={`/${pagePath}/${breadCrumbPath}`}
          />
        );
      })}
    </Breadcrumbs>
  );
};

export function ComponentBreakdownAccordion({
  childJobs,
  tableHeading,
  tableSubheading,
  breadCrumbEntries,
  status,
}: {
  childJobs?: Promise<ApiResponseWrapper<ChildJobTransformed[]>> | null;
  tableHeading: string;
  tableSubheading: string;
  breadCrumbEntries: Promise<Array<BreadCrumbEntry>> | null;
  status?: "complete" | "running" | "not started";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = usePageCopy("detail");
  return (
    <Accordion
      sx={{
        marginY: 4,
        "&:before": {
          display: "none",
        },
        width: "100%",
        ".MuiAccordionSummary-root > .Mui-expanded": {
          transform: "none",
        },
      }}
      elevation={0}
      expanded={isOpen}
      onChange={() => setIsOpen((isOpen) => !isOpen)}
    >
      <AccordionSummary
        expandIcon={
          <Stack direction="row" justifyContent="center" alignContent="center">
            <Typography color="primary.main">
              {isOpen ? "Show Less" : "Show More"}
            </Typography>
            {isOpen ? (
              <ExpandLessIcon color="primary" />
            ) : (
              <ExpandMoreIcon color="primary" />
            )}
          </Stack>
        }
      >
        <Stack>
          <Typography variant="h5">
            {copy?.content?.componentBreakdown || "Component Breakdown"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {copy?.content?.componentBreakdownSubHeading ||
              "Use this space to navigate components for a more detailed view."}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingTop: 0 }}>
        <Stack gap={4}>
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Suspense fallback={<BreadCrumbSkeletonRow />}>
              <Await resolve={breadCrumbEntries}>
                {(breadCrumbEntries) =>
                  breadCrumbEntries?.length ? (
                    <BreadCrumbRow entries={breadCrumbEntries} />
                  ) : null
                }
              </Await>
            </Suspense>
          </Stack>
          <Stack paddingBottom={2}>
            <Typography variant="h6" color="text.primary">
              {tableHeading}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tableSubheading}
            </Typography>
          </Stack>
          <Suspense
            fallback={
              <SkeletonTable
                headers={[
                  "Component Name",
                  "Type",
                  "Date",
                  "Status",
                  "Object ID",
                ]}
              />
            }
          >
            <Await resolve={childJobs}>
              {(childJobs) =>
                childJobs?.data.length ? (
                  <ChildJobsTable
                    headers={[
                      {
                        label: "Component Name",
                        value: "filename",
                        sortable: false,
                      },
                      { label: "Type", value: "type", sortable: false },
                      { label: "Date", value: "dateAnalyzed", sortable: false },
                      {
                        label: "Status",
                        value: "status",
                        sortable: false,
                      },
                      { label: "Object ID", value: "id", sortable: false },
                    ]}
                    linkKey="id"
                    linkIcon={() => <NavigateNextSharpIcon />}
                    totalItems={childJobs?.metadata?.page.total}
                    tableData={childJobs?.data.map((job) => ({
                      ...job,
                      dateAnalyzed: (
                        <Box display="flex" flexDirection="column">
                          <Typography variant="body2">
                            {dayjs
                              .utc(new Date(job.dateAnalyzed))
                              .local()
                              .format("MM/DD/YY")}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dayjs
                              .utc(new Date(job.dateAnalyzed))
                              .local()
                              .format("HH:mm:ss")}
                          </Typography>
                        </Box>
                      ),
                      status: (
                        <Chip
                          variant={
                            job.status === ProcessingStatus.COMPLETE
                              ? "outlined"
                              : "filled"
                          }
                          color={ProcessingStatusChipColor[job.status]}
                          label={toTitleCase(job.status)}
                        />
                      ),
                    }))}
                  />
                ) : status === ProcessingStatus.COMPLETE ? (
                  <CveStatusImage
                    maxWidth="160px"
                    image={copy?.images?.noVulnerabilities}
                    displayText={
                      copy?.content?.noSubcomponents ||
                      "No subcomponents found."
                    }
                  />
                ) : (
                  <CveStatusImage
                    image={copy?.images?.noResults}
                    maxWidth="160px"
                    displayText={
                      copy?.content?.analyzing ||
                      "Data is still being analyzed."
                    }
                  />
                )
              }
            </Await>
          </Suspense>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
