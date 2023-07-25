import invariant from "tiny-invariant";

export const bearFetch = async (path: string, init?: RequestInit) => {
  invariant(process.env.BEARCLAW_AUTH, "BEARCLAW_AUTH must be set");
  invariant(process.env.BEARCLAW_URL, "SESSION_SECRET must be set");

  const AUTH_TOKEN = Buffer.from(process.env.BEARCLAW_AUTH).toString("base64");
  const BASE_URL = process.env.BEARCLAW_URL;

  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Basic ${AUTH_TOKEN}`,
    },
  });
};
