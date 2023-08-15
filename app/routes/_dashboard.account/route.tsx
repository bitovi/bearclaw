import { Outlet, useLoaderData } from "@remix-run/react";
import { SideNav } from "~/components/sideNav/SideNav";
import { usePageCopy } from "../_dashboard/copy";
import { Page, PageHeader, InnerPage } from "../_dashboard/components/page";
import Stack from "@mui/material/Stack";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { getOrgId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const orgId = await getOrgId(request);

  return json({ orgId });
}

export default function Account() {
  const copy = usePageCopy("account");
  const { orgId } = useLoaderData<typeof loader>();
  return (
    <Page>
      <PageHeader
        headline={"User Account"}
        description={
          "Manage your personal details, subscription status, and overall account settings."
        }
      />
      <InnerPage
        navigation={<SideNav navMenu={copy?.subNavLinks || []} orgId={orgId} />}
      >
        <Stack
          flexGrow={1}
          alignContent={"center"}
          alignItems="center"
          marginX={2}
          paddingTop={2}
        >
          <Outlet />
        </Stack>
      </InnerPage>
    </Page>
  );
}
