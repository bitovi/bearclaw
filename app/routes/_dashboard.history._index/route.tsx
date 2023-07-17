import { Suspense } from "react";
import Box from "@mui/material/Box";
import HistoryTable, { SkeletonTable } from "../../components/table";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { Await, useLoaderData } from "@remix-run/react";
import type { TableEnhancedRSBOMListEntry } from "~/models/rsbomTypes";
import { getOrgandUserId } from "~/session.server";
import type { ApiResponseWrapper } from "~/models/apiUtils.server";
import { transformDate } from "./utils/transformDate.server";
import { Page, PageHeader } from "../_dashboard/components/page";

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);

  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const perPage = url.searchParams.get("perPage");
    const filter = url.searchParams.get("filter");
    const sort = url.searchParams.get("sort");
    const _rsbomList = await retrieveRSBOMList({
      userId,
      organizationId,
      page,
      perPage,
      filter,
      sort,
    });

    const rsbomList: ApiResponseWrapper<TableEnhancedRSBOMListEntry[]> = {
      ..._rsbomList,
      data: _rsbomList.data.map((d) => ({
        ...d,
        "@timestamp": transformDate(d["@timestamp"]),
      })),
    };

    return json({ rsbomList, error: "" });
  } catch (e) {
    const error = (e as Error).message;
    console.error(error);
    return json({ error, rsbomList: null });
  }
}

export default function Route() {
  const { rsbomList, error } = useLoaderData<typeof loader>();
  return (
    <Page>
      <PageHeader
        headline="History"
        description="Review the files you have analyzed in the past."
      >
        {/* TODO: Search & Filter Controls */}
      </PageHeader>
      <Suspense
        fallback={
          <SkeletonTable
            search
            searchFields={[]}
            tableTitle="History"
            headers={[
              "Id",
              "Filename",
              "Timestamp",
              "Data Object",
              "Type",
              "Status",
            ]}
          />
        }
      >
        <Await resolve={rsbomList}>
          {(rsbomList) => {
            if (error) {
              return <Box>{error}</Box>;
            }
            return (
              <Box>
                <HistoryTable<TableEnhancedRSBOMListEntry>
                  tableTitle={"Lists"}
                  tableData={rsbomList?.data || undefined}
                  totalItems={rsbomList?.metadata?.page.total}
                  linkKey="dataObject"
                  headers={[
                    { label: "Id", value: "id", sortable: true },
                    { label: "Filename", value: "filename", sortable: true },
                    { label: "Date", value: "@timestamp", sortable: true },
                    {
                      label: "Data Object",
                      value: "dataObject",
                      sortable: true,
                    },
                    { label: "Type", value: "mime-type", sortable: true },
                    {
                      label: "Status",
                      value: "completedStatus",
                      sortable: true,
                    },
                  ]}
                  tableContainerStyles={{ maxHeight: "600px" }}
                  search
                  searchFields={[
                    {
                      value: "dataObject",
                      label: "Data Object",
                    },
                    {
                      value: "filename",
                      label: "Filename",
                    },
                  ]}
                />
              </Box>
            );
          }}
        </Await>
      </Suspense>
    </Page>
  );
}
