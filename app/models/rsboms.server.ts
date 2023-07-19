import { bearFetch } from "~/services/bigBear/bearFetch.server";
import { buildApiSearchParams } from "~/services/bigBear/utils.server";
import type {
  ApiRequestParams,
  ApiResponseWrapper,
} from "~/services/bigBear/utils.server";
import type { ExpandedRSBOMEntry, RSBOMListEntry } from "./rsbomTypes";

export async function retrieveRSBOMList(params: ApiRequestParams = {}) {
  const searchParams = buildApiSearchParams(params);
  const response = await bearFetch(
    `/bear/get_rsboms_cyclonedx?${searchParams}`
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

  const { data } = await response.json();
  return data[0];
}
