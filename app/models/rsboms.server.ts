import { bearFetch } from "~/services/bigBear/bearFetch";
import type { ApiRequestParams, ApiResponseWrapper } from "./apiUtils.server";
import { buildApiSearchParams } from "./apiUtils.server";
import type { ExpandedRSBOMEntry, RSBOMListEntry } from "./rsbomTypes";

const baseURL = process.env.BEARCLAW_URL;

export async function retrieveRSBOMList(params: ApiRequestParams = {}) {
  const searchParams = buildApiSearchParams(params);
  const response = await fetch(
    `${baseURL}/bear/get_rsboms_cyclonedx?${searchParams}`
  );
  const json: ApiResponseWrapper<RSBOMListEntry[]> = await response.json();
  return json;
}

export async function retrieveRSBOMDetails({
  userId,
  organizationId,
  dataObjectId,
}: {
  userId?: string;
  organizationId?: string;
  dataObjectId: string;
}): Promise<ExpandedRSBOMEntry> {
  const searchParams = buildApiSearchParams({
    userId,
    organizationId,
  });

  const response = await bearFetch(
    `/bear/get_rsboms_cyclonedx/${dataObjectId}?${searchParams}`
  );
  console.log("data", response)
  const { data } = await response.json();
  return data[0];
}
