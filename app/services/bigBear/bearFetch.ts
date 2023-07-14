export const bearFetch = async (path: string, init?: RequestInit) => {
  const AUTH = process.env.BEARCLAW_AUTH;
  const BASE_URL = process.env.BEARCLAW_URL;
  if (!AUTH) throw new Error("BEARCLAW_AUTH is not set");
  if (!BASE_URL) throw new Error("BEARCLAW_URL is not set");
  console.log("BEARCLAW_AUTH", AUTH);
  console.log("BEARCLAW_URL", BASE_URL);
  console.log("Combined", `${BASE_URL}${path}`);
  console.log("auth", `Basic ${Buffer.from(AUTH).toString("base64")}`);

  return fetch(
    `${BASE_URL}${path}`,
    { 
      ...init, 
      headers: { 
        ...init?.headers, 
        "Authorization": `Basic ${Buffer.from(AUTH).toString("base64")}`,
      } 
    }
  );
}