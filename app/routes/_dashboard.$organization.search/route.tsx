import Box from "@mui/material/Box";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { NoResults } from "./components/noResults";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import SearchTable, { SkeletonTable } from "~/components/table";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { getOrgandUserId } from "~/session.server";
import { Page, PageHeader } from "../_dashboard/components/page";
import Typography from "@mui/material/Typography";
import { usePageCopy } from "../_dashboard/copy";
import { TextCopyIcon } from "~/components/textCopyIcon";
import SeverityChip from "~/components/severityChip";
import Chip from "@mui/material/Chip";
import { ProcessingStatus } from "../_dashboard.$organization.history.$/types";
import { toTitleCase } from "~/utils/string/toTitleCase";
import { ProcessingStatusChipColor } from "~/components/table/types";

dayjs.extend(utc);

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const perPage = url.searchParams.get("perPage") || "10";
  const sort = url.searchParams.get("sort");
  const search = url.searchParams.get("query");
  // if user vists /search with no query, return no results
  if (!search) {
    return json({
      search: "",
      error: "",
      rsboms: null,
      organizationId: null,
    });
  }

  try {
    const rsboms = await retrieveRSBOMList({
      userId,
      organizationId,
      page,
      perPage,
      search,
      sort,
    });
    return json({
      organizationId,
      search,
      rsboms,
      error: "",
    });
  } catch (e) {
    const error = (e as Error).message;
    console.error("ERROR: ", error);
    return json({
      organizationId: null,
      error,
      search,
      rsboms: null,
    });
  }
}

const tableHeaders = [
  { label: "Filename", value: "filename", sortable: true },
  { label: "Type", value: "mime-type", sortable: true },
  { label: "Date", value: "@timestamp", sortable: false },
  { label: "Status", value: "completed", sortable: false },
  { label: "Severity", value: "severity", sortable: false },
  { label: "Object ID", value: "dataObject", sortable: false },
];

export function Results() {
  const { rsboms, error, organizationId } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  if (error) {
    return <Box>{error}</Box>;
  }
  if (!rsboms || rsboms.data.length === 0) {
    return <NoResults />;
  }

  if (navigation.state === "loading") {
    return (
      <SkeletonTable
        headers={[
          "Filename",
          "Type",
          "Date",
          "Status",
          "Severity",
          "Object ID",
        ]}
      />
    );
  }

  return (
    <SearchTable
      totalItems={rsboms.metadata?.page.total}
      linkKey="dataObject"
      linkBasePath={`${organizationId}/history`}
      linkIcon={({ copyValue, buttonProps }) => (
        <TextCopyIcon copyValue={copyValue} buttonProps={buttonProps} />
      )}
      tableTitle=""
      headers={tableHeaders}
      tableData={rsboms.data.map((entry) => ({
        filename: entry.filename,
        ["mime-type"]: entry["mime-type"],
        "@timestamp": (
          <Box display="flex" flexDirection="column">
            <Typography variant="body2">
              {dayjs
                .utc(new Date(entry["@timestamp"]))
                .local()
                .format("MM/DD/YY")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dayjs
                .utc(new Date(entry["@timestamp"]))
                .local()
                .format("HH:mm:ss")}
            </Typography>
          </Box>
        ),
        completed: (
          <Chip
            variant={
              entry.status === ProcessingStatus.COMPLETE ? "outlined" : "filled"
            }
            color={ProcessingStatusChipColor[entry.status]}
            label={toTitleCase(entry.status)}
          />
        ),
        severity: <SeverityChip severity={entry.severity} />,
        dataObject: entry.dataObject,
      }))}
      tableContainerStyles={{ maxHeight: "600px" }}
    />
  );
}

export default function Route() {
  const { search, error, rsboms } = useLoaderData<typeof loader>();
  const copy = usePageCopy("search");

  const hasResults = !error && rsboms?.data.length;
  return (
    <Page>
      <PageHeader
        headline={
          <span>
            {copy?.headline || "Search"}:{" "}
            <Typography
              fontSize="inherit"
              fontWeight="inherit"
              component="span"
              color="primary.main"
            >
              {search || ""}
            </Typography>
          </span>
        }
        description={
          hasResults
            ? copy?.content?.hasResults ||
              "Here are the files we found based on your search."
            : copy?.content?.noResults ||
              "No matches found at this time. Please adjust your search query for better results."
        }
      />
      <Results />
    </Page>
  );
}
