import type { ApiRequestParams, ApiResponseWrapper } from "./apiUtils.server";
import { buildApiSearchParams } from "./apiUtils.server";
import type { ExpandedRSBOMEntry, RSBOMListEntry } from "./rsbomTypes";

const baseURL = process.env.BEARCLAW_URL;

export async function retrieveRSBOMList(
  options: ApiRequestParams = {}
) {
  const searchParams = buildApiSearchParams(options);
  console.log(`${baseURL}/bear/get_rsboms_cyclonedx?${searchParams}`)
  const response = await fetch(
    `${baseURL}/bear/get_rsboms_cyclonedx?${searchParams}`
  );
  const json: ApiResponseWrapper<RSBOMListEntry[]> = await response.json();
  return json;
}

export async function retrieveRSBOMDetails({
  userId: _userId,
  orgId: _orgId,
  dataObjectId,
}: {
  userId?: string;
  orgId?: string;
  dataObjectId: string;
}): Promise<ExpandedRSBOMEntry> {
  /**
    TODO: utilize userId and/or orgId to retrieve particular file histories 
    */

  const response = await fetch(
    `${baseURL}/claw/get_rsboms_cyclonedx/${dataObjectId}`
  );
  const { bc_rsbom_cyclonedx_aggregate } = await response.json();
  return bc_rsbom_cyclonedx_aggregate[0];
}
