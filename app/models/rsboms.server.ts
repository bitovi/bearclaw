import type { RSBOMListEntry } from "./rsbomTypes";

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
