function getPath(userId: string, orgId: string) {
  return `${process.env.BEARCLAW_URL}/claw/get_data_objects_by_user?userId=${userId}&groupId=${orgId}`;
}

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
}

export async function getAllDataObjects(userId: string, orgId: string) {
  try {
    const response = await fetch(getPath(userId, orgId));
    const data: DataObjectResponse = await response.json();
    return data.data_objects
  } catch (error) {
    console.error(error);
    return [];
  }
}
