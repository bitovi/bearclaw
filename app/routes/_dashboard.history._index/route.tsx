import { Suspense } from "react";
import Box from "@mui/material/Box";
import HistoryTable, { SkeletonTable } from "../../components/table";
import { defer } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";

import { getOrgandUserId } from "~/session.server";

import { Page, PageHeader } from "../_dashboard/components/page";
import { getProcessingStatus } from "~/services/bigBear/getProcessingStatus.server";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import Chip from "@mui/material/Chip";
import { toTitleCase } from "~/utils/string/toTitleCase";
import Stack from "@mui/material/Stack";
import { NavigationFilter } from "./components/NavigationFilter";

dayjs.extend(utc);

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);

  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const perPage = url.searchParams.get("perPage");
    const filter = url.searchParams.get("filter");
    const sort = url.searchParams.get("sort");
    const processingResults = getProcessingStatus({
      userId,
      organizationId,
      page,
      perPage,
      filter,
      sort,
    });

    return defer({ processingResults, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return defer({ error, processingResults: null });
  }
}

export default function Route() {
  const { processingResults, error } = useLoaderData<typeof loader>();

  return (
    <Page>
      <PageHeader
        headline="History"
        description="Review the files you have analyzed in the past."
      >
        <Stack
          alignItems={{ xs: "center", lg: "flex-end" }}
          direction="row"
          width="100%"
          height="100%"
          gap={2}
          justifyContent={{ xs: "center", lg: "unset" }}
        >
          <Suspense fallback={null}>
            <Await resolve={processingResults}>
              {() => (
                <NavigationFilter
                  dropdownLabel="Type"
                  dropdownOptions={[
                    { value: "_id", label: "Data Object" },
                    { value: "filename", label: "File Name" },
                  ]}
                  searchLabel={"Search"}
                />
              )}
            </Await>
          </Suspense>
        </Stack>
      </PageHeader>
      <Suspense
        fallback={
          <SkeletonTable
            headers={["File Name", "Type", "Date", "Status", "Object ID"]}
          />
        }
      >
        <Await resolve={processingResults}>
          {(uploads) => {
            if (error) {
              return <Box>{error}</Box>;
            }
            return (
              <Box>
                <HistoryTable
                  headers={[
                    { label: "File Name", value: "filename", sortable: true },
                    { label: "Type", value: "type", sortable: true },
                    { label: "Date", value: "analyzedAt", sortable: true },
                    { label: "Status", value: "status", sortable: true },
                    { label: "Object ID", value: "_id", sortable: false },
                  ]}
                  linkKey="_id"
                  totalItems={uploads?.metadata?.page.total}
                  tableData={uploads?.data.map((upload) => ({
                    filename: upload.filename,
                    type: upload.type,
                    analyzedAt: (
                      <Box display="flex" flexDirection="column">
                        <Typography variant="body2">
                          {dayjs
                            .utc(new Date(upload.analyzedAt))
                            .local()
                            .format("MM/DD/YY")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs
                            .utc(new Date(upload.analyzedAt))
                            .local()
                            .format("HH:mm:ss")}
                        </Typography>
                      </Box>
                    ),
                    status: <Chip label={toTitleCase(upload.status)} />,
                    _id: upload._id,
                  }))}
                />
              </Box>
            );
          }}
        </Await>
      </Suspense>
    </Page>
  );
}
