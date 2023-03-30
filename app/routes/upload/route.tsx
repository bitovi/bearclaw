import { Upload } from "~/components/upload/Upload";
import type { ActionArgs, UploadHandler } from "@remix-run/node"; // or cloudflare/deno
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"; // or cloudflare/deno
import { writeAsyncIterableToWritable } from "@remix-run/node"; // `writeAsyncIterableToWritable` is a Node-only utility
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

  const imageUrl = formData.get("avatar");

  // because our uploadHandler returns a string, that's what the imageUrl will be.
  // ... etc
};

export default function Route() {
  return (
    <div>
      <Upload />
    </div>
  );
}
