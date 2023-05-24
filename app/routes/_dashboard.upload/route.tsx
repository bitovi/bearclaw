import { Button } from "../../components/button/Button";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime"; // or cloudflare/deno
import { json } from "@remix-run/server-runtime"; // or cloudflare/deno
import {
  unstable_createFileUploadHandler,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"; // or cloudflare/deno
import { getOrgandUserId } from "~/session.server";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { Box, Typography } from "@mui/material";
import { readFile, unlink } from "fs/promises";
import { Loading } from "~/components/loading/Loading";

const CLAW_UPLOAD = process.env.BEARCLAW_URL || '';


export const action = async ({ request }: ActionArgs) => {
  const { userId, organizationId } = await getOrgandUserId(request);
  if (!userId || !organizationId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      avoidFileConflicts: true,
      directory: "/tmp",
      file: ({ filename }) => filename,
      maxPartSize: 500_000_000,
    }),
    unstable_createMemoryUploadHandler(),
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const filepath = (formData.get("files") as any)?.filepath as string;
  const file = await readFile(filepath, 'utf-8');

  const outboundFormData = new FormData();
  outboundFormData.append(
    "files",
    file,
  );

  outboundFormData.append("userId", typeof formData.get("userId") === "string"
    ? formData.get("userId")
    : userId
  );
  outboundFormData.append("groupId", typeof formData.get("groupId") === "string"
    ? formData.get("groupId")
    : organizationId
  );

  const response = await fetch(CLAW_UPLOAD, {
    method: "POST",
    body: formData
  });
  await unlink(filepath) // delete the temp file

  if (response.status !== 200) {
    return json({ status: 500 });
  }
  return json({ status: 200 });
};

type Props = {
  userId: string;
  organizationId: string;
};

export const Upload: React.FC<Props> = ({ userId, organizationId }) => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  if (
    navigation.state === "submitting" &&
    navigation.formAction === "/upload"
  ) {
    return (
      <Box>
        <Loading />
      </Box>
    )
  }

  return (
    <Form method="POST" encType="multipart/form-data" >
      <Box display="flex" flexDirection="column" gap="1rem" width="240px">
        <input type="file" name="files" aria-label="Select file to upload" />
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="groupId" value={organizationId} />
        <Button type="submit" variant="outlined">Upload</Button>
        {actionData?.status === 200 && (
          <Typography fontSize="0.75rem" fontWeight="500">
            File uploaded successfully
          </Typography>
        )}
      </Box>
    </Form>
  );
};

export const uploadAction = action;

export async function loader({ request }: LoaderArgs) {
  const { userId, organizationId } = await getOrgandUserId(request);

  if (!userId || !organizationId) {
    return new Response("Unauthorized", { status: 401 });
  }

  return json({ userId, organizationId });
}

export default function UploadPage() {
  const { userId, organizationId } = useLoaderData<typeof loader>();

  return <Upload userId={userId} organizationId={organizationId} />;
};