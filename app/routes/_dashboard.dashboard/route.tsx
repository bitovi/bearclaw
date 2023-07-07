import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/server-runtime";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { Upload, uploadAction } from "~/routes/_dashboard.upload/route";
import { getOrgandUserId, getUser } from "~/session.server";
import Table from "~/components/table/Table";
import { usePageCopy } from "../_dashboard/copy";
import { getKeyMetrics } from "../../services/bigBear/getKeyMetrics";
import { MetricCard } from "./components/MetricCard";
import { IconFromString } from "~/components/iconFromString/IconFromString";
import { Ellipse } from "./components/Ellipse.svg";
import { Button } from "~/components/button";
import background from "./components/background.png";
import { getProcessingStatus } from "~/services/bigBear/getProcessingStatus";
import { Chip } from "@mui/material";
import { toTitleCase } from "~/utils/string/toTitleCase";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const { userId, organizationId } = await getOrgandUserId(request);
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const perPage = url.searchParams.get("perPage");
  const sort = url.searchParams.get("sort");
  const [keyMetrics, uploads] = await Promise.all([
    getKeyMetrics({ days: 7, userId, organizationId }),
    getProcessingStatus({
      organizationId,
      page,
      perPage,
      sort,
    }),
  ]);
  console.log(uploads)
  return json({ user, keyMetrics, uploads, userId, organizationId });
}

export async function action(args: ActionArgs) {
  return uploadAction(args);
}

export const meta: V2_MetaFunction = () => [{ title: "Dashboard" }];

export default function Index() {
  const copy = usePageCopy("dashboard");
  const { userId, keyMetrics, organizationId, user, uploads } =
    useLoaderData<typeof loader>();

  return (
    <Box display="flex" flexDirection="column" gap="2rem">
      <Box display="flex" alignItems="center">
        <Box flex="1">
          <Typography>{copy?.headline}</Typography>
          <Typography fontSize="34px" fontWeight="400" lineHeight={2}>
            Welcome {user?.firstName}
          </Typography>
        </Box>
        <Box border="4px solid rgba(0,0,0,0.12)" borderRadius="12px">
          <Upload userId={userId} organizationId={organizationId} />
        </Box>
      </Box>
      <Box
        display="grid"
        gap="1rem"
        justifyContent="stretch"
        gridTemplateColumns={{
          xs: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
      >
        {/* TODO: Add proper sorting params to links */}
        <MetricCard
          variant="files"
          count={keyMetrics?.totalFilesAnalyzed || 0}
          message="Total files analyzed"
          to="/history"
        />
        <MetricCard
          variant="vulnerabilities"
          count={keyMetrics?.totalVulnerabilitiesCaptured || 0}
          message="Total vulnerabilities captured"
          to="/history?sort=totalVulnerabilitiesCaptured"
        />
        <MetricCard
          variant="cves"
          count={keyMetrics?.numberofCriticalWarnings || 0}
          message="CVEs with critical scores"
          to="/history?sort=numberofCriticalWarnings"
        />
        <Box
          minWidth="22.5rem"
          display="flex"
          gap={1}
          padding="1rem"
          justifyContent="center"
          alignItems="flex-start"
          alignSelf="stretch"
          borderRadius="20px"
          color="white"
          sx={{
            background:
              "linear-gradient(189deg, rgba(51, 51, 51, 0.80) 0%, rgba(0, 0, 0, 0.80) 72.94%), lightgray 50% / cover no-repeat",
          }}
          position="relative"
        >
          <Box
            component="img"
            src={background}
            position="absolute"
            top="0"
            left="0"
            height="100%"
            width="100%"
            sx={{ objectFit: "cover", opacity: 0.5, mixBlendMode: "overlay" }}
          />
          <Box display="flex" flexDirection="column" gap={1}>
            <Box
              display="flex"
              fontSize="2rem"
              alignItems="center"
              gap="0.5rem"
            >
              <IconFromString icon="addChartTwoTone" />
              <Typography variant="h5">Workflows</Typography>
            </Box>
            <Typography variant="subtitle2">
              Update plan to add more workflows.
            </Typography>
            <Box display="flex" gap="1rem">
              <Button variant="whiteOutlined" size="small">
                Update plan
              </Button>
              <Button size="small" variant="whiteOutlined">
                View
              </Button>
            </Box>
          </Box>
          <Box flex="1" display="flex" justifyContent="center" paddingTop={1}>
            <Ellipse number={2} />
          </Box>
        </Box>
      </Box>
      <Box>
        {uploads && uploads.data.length > 0 ? (
          <Table
            tableTitle="Recent Activity"
            headers={[
              { label: "File Name", value: "filename", sortable: false },
              { label: "Type", value: "type", sortable: false },
              { label: "Date", value: "analyzedAt", sortable: false },
              { label: "Size", value: "size", sortable: false },
              { label: "Status", value: "status", sortable: false },
              { label: "Object ID", value: "_id", sortable: false },
            ]}
            linkKey="_id"
            totalItems={uploads.metadata?.page.total}
            tableData={uploads.data.map((upload) => ({
              filename: upload.filename,
              type: upload.type,
              analyzedAt: upload.analyzedAt,
              size: upload.size,
              status: <Chip label={toTitleCase(upload.status)} />,
              _id: upload._id,
            }))}
          />
        ) : (
          <Box component={Paper} variant="outlined" padding={2}>
            <Typography fontStyle="italic">No activity yet</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
