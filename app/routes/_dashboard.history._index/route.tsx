import { Suspense } from "react";
import { Box } from "@mui/material";
import HistoryTable, { SkeletonTable } from "../../components/table";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { retrieveRSBOMList } from "~/models/rsboms.server";
import { Await, useLoaderData } from "@remix-run/react";
import type { RSBOMListEntry } from "~/models/rsbomTypes";
import { getOrgandUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const perPage = url.searchParams.get("perPage");
    const filter = url.searchParams.get("filter");
    const sort = url.searchParams.get("sort");
    const rsbomList = await retrieveRSBOMList({
      userId,
      organizationId,
      page,
      perPage,
      filter,
      sort,
    });

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
              <HistoryTable<RSBOMListEntry>
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
  );
}
