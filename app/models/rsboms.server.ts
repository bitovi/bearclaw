import type { ExpandedRSBOMEntry, RSBOMListEntry } from "./rsbomTypes";

const baseURL = process.env.BEAR_CLAW_SERVER;

export async function retrieveRSBOMList(
  _userId?: string,
  _orgId?: string
): Promise<RSBOMListEntry[]> {
  /**
    TODO: utilize userId and/or orgId to retrieve particular file histories 
    */

  const response = await fetch(`${baseURL}/bear/get_rsboms_cyclonedx`);
  const { bc_rsbom_cyclonedx_aggregate } = await response.json();
  return bc_rsbom_cyclonedx_aggregate;
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
    `${baseURL}/bear/get_rsboms_cyclonedx/${dataObjectId}`
  );
  const { bc_rsbom_cyclonedx_aggregate } = await response.json();
  return bc_rsbom_cyclonedx_aggregate;
}
