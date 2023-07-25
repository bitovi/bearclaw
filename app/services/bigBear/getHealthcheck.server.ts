import { bearFetch } from "./bearFetch.server";

export const getHealthcheck = async () => {
  const response = await bearFetch("/healthcheck");
  const json: { status?: string } = await response.json();
  if (!json.status) throw new Error("No status found");
  return json;
};
