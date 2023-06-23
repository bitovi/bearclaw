export const config = {
  projectId: process.env.SANITY_PROJECT_ID || "samchn6r", // NOT private, so ok to commit
  dataset: "production",
  apiVersion: "2023-06-14", // use current UTC date - see "specifying API version"!
  useCdn: process.env.NODE_ENV === "production" ? true : false, // `false` if you want to ensure fresh data
} as const;
