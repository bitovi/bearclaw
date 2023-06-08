require("dotenv").config();

const { setupServer } = require("msw/node");
const { rest } = require("msw");
const fixture_getRSBOMSCyclonedx = require("./fixtures/getRSBOMSCyclonedx.js");
const fixture_getAllParentJobs = require("./fixtures/getAllParentJobs.js");
const fixture_getRSBOMDetail = require("./fixtures/getRSBOMDetail.js");

const baseURL = process.env.BEARCLAW_URL;

function parseFilterParam(filterParam) {
  // regex to return values within "contains(______,______)"
  // 0 index will be field, 1 index will be value
  const result = filterParam?.match(/\((.*?)\)/)?.[1].split(",");
  return {
    _searchField: result?.[0],
    _searchString: result?.[1],
  };
}

const handlers = [
  rest.get(`${baseURL}/claw/get_rsboms_cyclonedx`, (req, res, ctx) => {
    const { _searchField, _searchString } = parseFilterParam(
      req.url.searchParams.get("filter")
    );

    if (_searchField && _searchString) {
      const filteredList =
        fixture_getRSBOMSCyclonedx.bc_rsbom_cyclonedx_aggregate.filter(
          (item) => {
            return item[_searchField]
              .toLowerCase()
              .includes(_searchString.toLowerCase());
          }
        );
      return res(ctx.json({ bc_rsbom_cyclonedx_aggregate: filteredList }));
    }

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
