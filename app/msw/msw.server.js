require("dotenv").config();

const { setupServer } = require("msw/node");
const { rest } = require("msw");
const fixture_getRSBOMSCyclonedx = require("./fixtures/getRSBOMSCyclonedx.js");
const fixture_getAllParentJobs = require("./fixtures/getAllParentJobs.js");
const fixture_getRSBOMDetail = require("./fixtures/getRSBOMDetail.js");

const baseURL = process.env.BEARCLAW_URL;

const handlers = [
  rest.get(`${baseURL}/claw/get_rsboms_cyclonedx`, (req, res, ctx) => {
    return res(ctx.json(fixture_getRSBOMSCyclonedx));
  }),
  rest.get(`${baseURL}/claw/get_rsboms_cyclonedx/*`, (req, res, ctx) => {
    return res(ctx.json(fixture_getRSBOMDetail));
  }),
  rest.get(`${baseURL}/claw/get_all_parent_jobs`, (req, res, ctx) => {
    return res(ctx.json(fixture_getAllParentJobs));
  }),
];

const server = setupServer(...handlers);

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

const closeServer = () => server.close();
// in case of remount, remove listeners before re-subscribing
process.removeListener("SIGINT", closeServer);
process.removeListener("SIGTERM", closeServer);
process.once("SIGINT", closeServer);
process.once("SIGTERM", closeServer);
