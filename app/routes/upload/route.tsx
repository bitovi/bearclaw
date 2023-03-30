import { Upload, uploadAction } from "~/components/upload/Upload";
import type { ActionArgs } from "@remix-run/node"; // or cloudflare/deno

export async function action(args: ActionArgs) {
  uploadAction(args);
}

export default function Route() {
  return (
    <div>
      <Upload />
    </div>
  );
}
