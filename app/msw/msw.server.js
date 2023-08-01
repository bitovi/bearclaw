require("dotenv").config();

const { setupServer } = require("msw/node");
const { rest } = require("msw");

const fixture_getRSBOMSCyclonedx = require("./fixtures/getRSBOMSCyclonedx.js");
const fixture_getAllParentJobs = require("./fixtures/getAllParentJobs.js");
const fixture_getProcessingStatusById = require("./fixtures/getProcessingStatusById.js");
const fixture_getRSBOMDetail = require("./fixtures/getRSBOMDetail.js");
const fixture_getMetadata = require("./fixtures/getMetadata.js");
const fixture_getCVEData = require("./fixtures/getCVEData.js");
const fixture_getAllChildJobs = require("./fixtures/getAllChildJobs.js");

const paginateResults = require("./util/paginateResults.js");
const sortResults = require("./util/sortResults.js");
const filterResults = require("./util/filterResults.js");
const searchResults = require("./util/searchResults.js");

const baseURL = process.env.BEARCLAW_URL;

function processParams(data, url) {
  const filteredResults = filterResults(data, url);
  const searchedResults = searchResults(filteredResults, url);
  const sortedResults = sortResults(searchedResults, url);
  const paginatedResults = paginateResults(sortedResults, url);
  return paginatedResults;
}

const handlers = [
  rest.get(`${baseURL}/bear/get_rsboms_cyclonedx`, (req, res, ctx) => {
    return res(
      ctx.json(
        processParams(
          fixture_getRSBOMSCyclonedx.bc_rsbom_cyclonedx_aggregate,
          req.url
        )
      )
    );
  }),
  rest.get(`${baseURL}/bear/get_rsboms_cyclonedx/*`, (req, res, ctx) => {
    return res(ctx.json(processParams(fixture_getRSBOMDetail, req.url)));
  }),
  rest.get(`${baseURL}/claw/get_processing_status`, (req, res, ctx) => {
    return res(ctx.json(processParams(fixture_getAllParentJobs, req.url)));
  }),
  rest.get(`${baseURL}/claw/get_processing_status/*`, (req, res, ctx) => {
    return res(ctx.json(fixture_getProcessingStatusById));
  }),
  rest.get(`${baseURL}/bear/get_metadata`, (req, res, ctx) => {
    return res(ctx.json(fixture_getMetadata));
  }),
  rest.get(`${baseURL}/bear/get_cve_data/*`, (req, res, ctx) => {
    return res(ctx.json(fixture_getCVEData));
  }),
  rest.get(`${baseURL}/claw/get_all_child_jobs/*`, (req, res, ctx) => {
    return res(ctx.json(fixture_getAllChildJobs));
  }),
  rest.post(`${baseURL}/claw/upload`, (req, res, ctx) => {
    return res(ctx.json({ status: 200 }));
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
