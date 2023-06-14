import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/server-runtime";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

import { Upload, uploadAction } from "~/routes/_dashboard.upload/route";
import { getOrgandUserId, getUser } from "~/session.server";
import { getAllParentJobs } from "~/services/getAllParentJobs";
import Table from "~/components/table/Table";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const { userId, organizationId } = await getOrgandUserId(request);
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const perPage = url.searchParams.get("perPage")
  const jobs = await getAllParentJobs({ userId, organizationId, page, perPage });
  return json({ user, jobs, userId, organizationId });
}

export async function action(args: ActionArgs) {
  return uploadAction(args);
}

export const meta: V2_MetaFunction = () => [{ title: "Dashboard" }];

export default function Index() {
  const { userId, organizationId, user, jobs } = useLoaderData<typeof loader>();
  return (
    <Box display="flex" flexDirection="column" gap="2rem">
      <Box display="flex" alignItems="center">
        <Box flex="1">
          <Typography>Dashboard</Typography>
          <Typography fontSize="34px" fontWeight="400" lineHeight={2}>
            Welcome {user?.firstName}
          </Typography>
        </Box>
        <Box border="1px dashed #999" padding="1rem">
          <Upload userId={userId} organizationId={organizationId} />
        </Box>
      </Box>
      <Divider />
      <Box display="flex" gap="1.5rem" justifyContent="stretch">
        <Box
          flex="1"
          component={Paper}
          variant="outlined"
          padding="2rem 1rem"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Typography color="#999">100</Typography>
          <Typography color="#999">Total No. Of Files Analyzed</Typography>
        </Box>
        <Box
          flex="1"
          component={Paper}
          variant="outlined"
          padding="2rem 1rem"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Typography color="#999">1,234</Typography>
          <Typography color="#999">Total No. Of Files Analyzed</Typography>
        </Box>
        <Box
          flex="1"
          component={Paper}
          variant="outlined"
          padding="2rem 1rem"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Typography color="#999">689</Typography>
          <Typography color="#999">Total No. Of Vulnerabilities</Typography>
        </Box>
        <Box
          flex="1"
          component={Paper}
          variant="outlined"
          padding="2rem 1rem"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Typography color="#999">3</Typography>
          <Typography color="#999">Critical Level Warnings</Typography>
        </Box>
      </Box>
      <Box>
        {jobs && jobs.data.length > 0 ? (
          <Table
            tableTitle="Recent Activity"
            headers={["File Name", "Type", "Status", "Object ID"]}
            totalItems={jobs.metadata?.page.total}
            tableData={jobs.data.map((job) => {
              return {
                fileName: job.filename,
                type: job.type,
                status: job.status,
                objectId: job._id,
              };
            })}
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
