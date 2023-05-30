const { setupServer } = require("msw/node");
const { rest } = require("msw");
const fixture_getRSBOMSCyclonedx = require("./mockData/getRSBOMSCyclonedx.ts");
const fixture_getAllParentJobs = require("./mockData/getAllParentJobs.js");

const handlers = [
  rest.get(
    `http://44.214.117.70:5001/claw/get_rsboms_cyclonedx`,
    (req, res, ctx) => {
      return res(ctx.json(fixture_getRSBOMSCyclonedx));
    }
  ),
  rest.get(
    "http://44.214.117.70:5001/claw/get_all_parent_jobs",
    (req, res, ctx) => {
      return res(ctx.json(fixture_getAllParentJobs));
    }
  ),
];

const server = setupServer(...handlers);

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
