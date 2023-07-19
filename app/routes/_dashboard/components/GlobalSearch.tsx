import { useEffect, useState } from "react";
import { Form, useLocation, useSearchParams } from "@remix-run/react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { parseFilterParam } from "~/utils/parseFilterParam";

// TODO: Replace with real results from API
const fakeResults = ["file number 1", "scaryBadFile", "not_a_w0rm.exe"];

export function GlobalSearch() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const { _searchString } = parseFilterParam(searchParams.get("filter"));
  const [searchString, setSearchString] = useState(_searchString || null);

  useEffect(() => {
    if (location.pathname) {
      setSearchString(_searchString || "");
    }
  }, [_searchString, location.pathname]);

  return (
    <Box
      component={Form}
      method="get"
      action="/search"
      width="236px"
      margin="0"
    >
      <input
        type="hidden"
        name="filter"
        value={`contains(search,${searchString})`}
      />
      <Autocomplete
        freeSolo
        options={fakeResults}
        value={searchString}
        onChange={(_, value) => setSearchString(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="standard"
            size="small"
            type="text"
            placeholder="Search Files"
          />
        )}
      />
    </Box>
  );
}
