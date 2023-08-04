import invariant from "tiny-invariant";

export const bearFetch = async (path: string, init?: RequestInit) => {
  invariant(process.env.BEARCLAW_URL, "SESSION_SECRET must be set");

  const BASE_URL = process.env.BEARCLAW_URL;
  const AUTH_TOKEN =
    process.env.BEARCLAW_AUTH &&
    Buffer.from(process.env.BEARCLAW_AUTH).toString("base64");

  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      ...(AUTH_TOKEN ? { Authorization: `Basic ${AUTH_TOKEN}` } : {}),
    },
  });
};
