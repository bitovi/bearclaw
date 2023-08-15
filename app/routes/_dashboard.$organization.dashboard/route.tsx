import { Await, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/server-runtime";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import {
  Upload,
  uploadAction,
} from "~/routes/_dashboard.$organization.upload/route";
import { getOrgandUserId, getUser } from "~/session.server";
import Table, { SkeletonTable } from "~/components/table/Table";
import { getKeyMetrics } from "../../services/bigBear/getKeyMetrics.server";
import { getProcessingStatus } from "~/services/bigBear/getProcessingStatus.server";
import { toTitleCase } from "~/utils/string/toTitleCase";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Suspense } from "react";
import { Page, PageHeader } from "../_dashboard/components/page";
import { KeyMetrics } from "./components/KeyMetrics";
import { TextCopyIcon } from "~/components/textCopyIcon";

dayjs.extend(utc);

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const { userId, organizationId } = await getOrgandUserId(request);

  const keyMetrics = getKeyMetrics({
    days: 7,
    userId,
    organizationId,
  });
  const uploads = getProcessingStatus({
    organizationId,
    page: "1",
    perPage: "3",
  });

  return defer({ user, keyMetrics, uploads, userId, organizationId });
}

export async function action(args: ActionArgs) {
  return uploadAction(args);
}

export const meta: V2_MetaFunction = () => [{ title: "Dashboard" }];

export default function Index() {
  const { userId, keyMetrics, organizationId, user, uploads } =
    useLoaderData<typeof loader>();

  return (
    <Page>
      <PageHeader
        headline={`Welcome ${user?.firstName || ""}`}
        description={"Here is the latest data on your account."}
      >
        <Box border="4px solid rgba(0,0,0,0.12)" borderRadius="12px">
          <Upload userId={userId} organizationId={organizationId} />
        </Box>
      </PageHeader>
      <Suspense fallback={<KeyMetrics />}>
        <Await resolve={keyMetrics}>
          {(metrics) => (
            <KeyMetrics
              totalFilesAnalyzed={metrics?.totalFilesAnalyzed || 0}
              totalVulnerabilitiesCaptured={
                metrics?.totalVulnerabilitiesCaptured || 0
              }
              numberofCriticalWarnings={metrics?.numberofCriticalWarnings || 0}
            />
          )}
        </Await>
      </Suspense>
      <Box>
        <Suspense
          fallback={
            <SkeletonTable
              tableTitle="Recent Activity"
              headers={["File Name", "Type", "Date", "Status", "Object ID"]}
              rows={3}
            />
          }
        >
          <Await resolve={uploads}>
            {(uploads) =>
              uploads?.data && uploads.data.length > 0 ? (
                <Table
                  tableTitle="Recent Activity"
                  headers={[
                    { label: "File Name", value: "filename", sortable: true },
                    { label: "Type", value: "type", sortable: true },
                    { label: "Date", value: "analyzedAt", sortable: true },
                    { label: "Status", value: "status", sortable: true },
                    { label: "Object ID", value: "_id", sortable: false },
                  ]}
                  linkKey="_id"
                  linkBasePath={`/${organizationId}/history`}
                  linkIcon={({ copyValue, buttonProps }) => (
                    <TextCopyIcon
                      copyValue={copyValue}
                      buttonProps={buttonProps}
                    />
                  )}
                  totalItems={uploads.metadata?.page.total}
                  tableData={uploads.data.map((upload) => ({
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
              ) : (
                <Box component={Paper} variant="outlined" padding={2}>
                  <Typography fontStyle="italic">No activity yet</Typography>
                </Box>
              )
            }
          </Await>
        </Suspense>
      </Box>
    </Page>
  );
}
