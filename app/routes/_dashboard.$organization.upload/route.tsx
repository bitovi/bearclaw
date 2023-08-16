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
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import UploadFileTwoToneIcon from "@mui/icons-material/UploadFileTwoTone";
import { Loading } from "~/components/loading/Loading";
import { useDropzone } from "react-dropzone";
import { bytesToDisplaySize, truncateFileName } from "~/utils/fileDisplay";
import { useCallback, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { unlink } from "fs/promises";
import { bearFetch } from "~/services/bigBear/bearFetch.server";
import { retrieveActiveOrganizationUser } from "~/models/organizationUsers.server";

export const action = async ({ request }: ActionArgs) => {
  const { userId, organizationId } = await getOrgandUserId(request);

  const orgUser = await retrieveActiveOrganizationUser({
    userId,
    organizationId,
  });

  if (!orgUser) {
    return json({ success: false }, { status: 500 });
  }

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      avoidFileConflicts: true,
      directory: "/tmp",
      file: ({ filename }) => filename,
      maxPartSize: 500_000_000,
    }),
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  formData.append("userId", userId);
  formData.append("groupId", organizationId);

  const CLAW_UPLOAD = `/claw/upload`;
  const response = await bearFetch(CLAW_UPLOAD, {
    method: "POST",
    body: formData,
  });

  const filepath = (formData.get("files") as any)?.filepath as string;
  await unlink(filepath); // delete the temp file

  if (response.status >= 400) {
    return json({ success: false }, { status: 500 });
  }

  // delay to allow the file to appear in the loader queries
  await new Promise((resolve) => setTimeout(resolve, 10000));

  return json({ success: true }, { status: 200 });
};

type Props = {
  userId: string;
  organizationId: string;
};

export const Upload: React.FC<Props> = () => {
  const [uploadMessage, setUploadMessage] = useState<string | null>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const input = useRef<HTMLInputElement>(null);
  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      invariant(input.current);

      const dT = new DataTransfer();
      for (const file of acceptedFiles) {
        dT.items.add(file);
      }

      input.current.files = dT.files;
      setUploadMessage(null);
    },
    [setUploadMessage]
  );
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop, maxFiles: 1 });

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    // directly mutating acceptedFiles.length in order to clear the list of selected files after an upload submission
    if (actionData?.success === true) {
      acceptedFiles.length = 0;
      setUploadMessage("File uploaded successfully");
      timer = setTimeout(() => {
        setUploadMessage("");
      }, 2000);
    } else if (actionData?.success === false) {
      acceptedFiles.length = 0;
      setUploadMessage("File uploaded failed");
      timer = setTimeout(() => {
        setUploadMessage("");
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    };
    // TODO refactor to avoid disabling exhaustive deps check and directly mutating state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  if (navigation.state === "submitting") {
    return (
      <Box
        display="flex"
        alignItems="center"
        padding={2}
        width="340px"
        height="100px"
      >
        <Loading />
      </Box>
    );
  }

  const { onClick: onUploadClick, ...rootProps } = getRootProps();

  return (
    <Box
      component={Form}
      method="POST"
      encType="multipart/form-data"
      margin="0"
      {...rootProps}
    >
      <Box
        display="flex"
        alignItems="center"
        gap="1rem"
        width="340px"
        height="100px"
        padding="0.5rem 1rem"
      >
        <Box flex="1">
          <input
            {...getInputProps()}
            aria-label="Select file to upload"
            ref={input}
            name="files"
            type="file"
          />
          {acceptedFiles.length > 0 ? (
            acceptedFiles.map((file) => (
              <ListItem key={file.name} disablePadding>
                <Box display="flex">
                  <Typography flex="1" textOverflow="ellipsis">
                    {truncateFileName(file.name, 14)}
                  </Typography>
                  <Typography>-</Typography>
                  <Typography>{bytesToDisplaySize(file.size)}</Typography>
                </Box>
              </ListItem>
            ))
          ) : isDragActive ? (
            <Typography>Drop the files here ...</Typography>
          ) : (
            <Box>
              <Typography
                color="blue"
                onClick={onUploadClick}
                sx={{ cursor: "pointer" }}
              >
                Click to upload
              </Typography>
              <Typography>or drag 'n drop'</Typography>
            </Box>
          )}
          {uploadMessage && (
            <Typography
              fontSize="0.75rem"
              fontWeight="500"
              color={actionData?.success === false ? "red.800" : "grey.800"}
            >
              {uploadMessage}
            </Typography>
          )}
        </Box>
        <Button
          aria-label="Upload"
          type="submit"
          variant="text"
          disabled={!acceptedFiles || acceptedFiles.length === 0}
        >
          <UploadFileTwoToneIcon sx={{ fontSize: "4rem" }} />
        </Button>
      </Box>
    </Box>
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
}
