import { useId } from "react";
import { Button } from "../button/Button";
import type {
  ActionArgs,
  UploadHandler,
  writeAsyncIterableToWritable,
} from "@remix-run/node"; // or cloudflare/deno
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"; // or cloudflare/deno
import { getUserId } from "~/session.server";

const CLAW_UPLOAD = `${process.env.BEARCLAW_URL}/claw/upload`;

async function uploadToClaw(data: any) {
  return fetch(CLAW_UPLOAD, {
    method: "POST",
    body: data,
  });
}

export const uploadAction = async ({ request }: ActionArgs) => {
  const userId = getUserId(request);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      if (name !== "img") {
        return undefined;
      }
      const uploadedFile = await uploadToClaw(data);
      return uploadedFile.url;
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  // because our uploadHandler returns a string, that's what the imageUrl will be.
  // ... etc
  return formData;
};

type Props = {};

export const Upload: React.FC<Props> = () => {
  const id = useId();

  return (
    <form>
      <div className="flex flex-col gap-4">
        <label htmlFor={id}>Upload a file</label>
        <input id={id} type="file" />
        <Button type="submit">Upload</Button>
      </div>
    </form>
  );
};
