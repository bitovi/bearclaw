import Box from "@mui/material/Box";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { NoResults } from "./components/noResults";
import SearchTable, { SkeletonTable } from "~/components/table";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { getOrgandUserId } from "~/session.server";
import { Page, PageHeader } from "../_dashboard/components/page";
import Typography from "@mui/material/Typography";
import { usePageCopy } from "../_dashboard/copy";
import { TextCopyIcon } from "~/components/textCopyIcon";

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
      search,
      rsboms,
      error: "",
    });
  } catch (e) {
    const error = (e as Error).message;
    console.error("ERROR: ", error);
    return json({
      error,
      search,
      rsboms: null,
    });
  }
}

const tableHeaders = [
  {
    label: "Id",
    value: "id",
    sortable: false,
  },
  { label: "Filename", value: "filename", sortable: true },
  { label: "Date", value: "@timestamp", sortable: true },
  { label: "Object Id", value: "dataObject", sortable: true },
  { label: "Type", value: "mime-type", sortable: true },
  { label: "Status", value: "completedStatus", sortable: true },
];

export function Results() {
  const { rsboms, error } = useLoaderData<typeof loader>();

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
          "Id",
          "Filename",
          "Timestamp",
          "Data Object",
          "Type",
          "Status",
        ]}
      />
    );
  }

  return (
    <SearchTable<RSBOMListEntry>
      tableData={rsboms.data || undefined}
      totalItems={rsboms.metadata?.page.total}
      linkKey="dataObject"
      linkBasePath="history"
      linkIcon={({ copyValue, buttonProps }) => (
        <TextCopyIcon copyValue={copyValue} buttonProps={buttonProps} />
      )}
      tableTitle=""
      headers={tableHeaders}
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
