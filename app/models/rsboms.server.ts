import { iterateOverObject } from "~/utils/iterateOverObject";
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
  const { data } = await response.json();
  return data[0];
}

export async function retrieveRSBOMSearchResults(
  params: ApiRequestParams = {},
  searchString: string
) {
  const searchParams = buildApiSearchParams(params);
  const historyResponse = await fetch(
    `${baseURL}/bear/get_rsboms_cyclonedx?${searchParams}`
  );
  const historyJSON: ApiResponseWrapper<RSBOMListEntry[]> =
    await historyResponse.json();

  const detailResponseList = await Promise.all(
    historyJSON.data.map((r) =>
      fetch(`${baseURL}/claw/get_rsboms_cyclonedx/${r.dataObject}`).then((r) =>
        r
          .json()
          .then(
            (rJSON: ApiResponseWrapper<ExpandedRSBOMEntry[]>) => rJSON.data[0]
          )
      )
    )
  );

  const filteredDetails = detailResponseList.reduce<string[]>((acc, curr) => {
    if (
      iterateOverObject(curr, searchString) &&
      curr.metadata?.component?.["bom-ref"]
    ) {
      return [...acc, curr.metadata?.component?.["bom-ref"]];
    } else {
      return acc;
    }
  }, []);

  const finalResult = historyJSON.data.filter((r) => {
    return (
      filteredDetails.some((i) => i === r.dataObject) ||
      Object.keys(r).some((key) => {
        if (r[key as keyof RSBOMListEntry]) {
          return r[key as keyof RSBOMListEntry]
            .toLowerCase()
            .includes(searchString.toLowerCase());
        }
        return false;
      })
    );
  });

  return {
    ...historyJSON,
    data: finalResult,
  };
}
