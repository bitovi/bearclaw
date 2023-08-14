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
import { usePageCopy } from "../_dashboard/copy";
import { TextCopyIcon } from "~/components/textCopyIcon";
import { ProcessingStatusChipColor } from "~/components/table/types";
import { ProcessingStatus } from "../_dashboard.$organization.history.$/types";

dayjs.extend(utc);

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);

  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const perPage = url.searchParams.get("perPage") || "10";
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
  const copy = usePageCopy("history");
  return (
    <Page>
      <PageHeader
        headline={copy?.title || "History"}
        description={
          copy?.headline || "Review the files you have analyzed in the past."
        }
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
                  textInputProps={{
                    name: copy?.inputs?.search.name || "search",
                    label: copy?.inputs?.search.label || "Search",
                    placeholder:
                      copy?.inputs?.search.placeholder || "Search files",
                  }}
                  dropdownOptions={
                    copy?.inputs?.type.questionType === "select"
                      ? copy?.inputs?.type.optionList
                      : []
                  }
                  dropdownProps={{
                    name: copy?.inputs?.type.name || "type",
                    label: copy?.inputs?.type.label || "Type",
                  }}
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
                  linkIcon={({ copyValue, buttonProps }) => (
                    <TextCopyIcon
                      copyValue={copyValue}
                      buttonProps={buttonProps}
                    />
                  )}
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
                    status: (
                      <Chip
                        variant={
                          upload.status === ProcessingStatus.COMPLETE
                            ? "outlined"
                            : "filled"
                        }
                        color={ProcessingStatusChipColor[upload.status]}
                        label={toTitleCase(upload.status)}
                      />
                    ),
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
