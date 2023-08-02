import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { Suspense } from "react";
import { Await, Link, useLocation } from "@remix-run/react";
import Breadcrumbs from "@mui/material/Breadcrumbs";

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
            sx={{ marginY: 1 }}
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
}: {
  childJobs?: Promise<ApiResponseWrapper<ChildJobTransformed[]>> | null;
  tableHeading: string;
  tableSubheading: string;
  breadCrumbEntries: Promise<Array<BreadCrumbEntry>> | null;
}) {
  return (
    <Accordion
      sx={{
        marginY: 4,
        "&:before": {
          display: "none",
        },
        width: "100%",
      }}
      elevation={0}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack>
          <Typography variant="h5">{"Component Breakdown"}</Typography>
          <Typography variant="body2" color="text.secondary">
            {"Use this space to navigate components for a more detailed view."}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" gap={2} flexWrap="wrap" paddingBottom={2}>
          <Suspense fallback={<BreadCrumbSkeletonRow />}>
            <Await resolve={breadCrumbEntries}>
              {(breadCrumbEntries) => (
                <>
                  {breadCrumbEntries?.length ? (
                    <BreadCrumbRow entries={breadCrumbEntries} />
                  ) : null}
                </>
              )}
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
            {(childJobs) => (
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
            )}
          </Await>
        </Suspense>
      </AccordionDetails>
    </Accordion>
  );
}
