import type { ApiRequestParams } from "~/models/apiUtils.server";
import { buildApiSearchParams } from "~/models/apiUtils.server";

export type DataObject = {
  createdByUserId: string;
  createdDateTime: string;
  extraData: {
    key: string;
    value: string | number | Record<string, string>;
  }[];
  groupId: string;
  history: {
    createdByUserId: string;
    createdDateTime: string;
    level: string;
    text: string;
  }[];
  id: string;
  lastUpdateDateTime: string;
  name: string;
  type: string;
  userId: string;
};

type DataObjectResponse = {
  data_objects: DataObject[];
};

export async function getAllDataObjects(
  params: ApiRequestParams
): Promise<DataObject[]> {
  try {
    const url = `${
      process.env.BEARCLAW_URL
    }/claw/get_data_objects?${buildApiSearchParams(params)}`;
    const response = await fetch(url);
    const data: DataObjectResponse = await response.json();
    return data.data_objects;
  } catch (error) {
    console.error(error);
    return [];
  }
}
