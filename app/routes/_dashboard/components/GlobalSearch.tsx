import { useEffect, useState } from "react";
import { Form, useLocation, useSearchParams } from "@remix-run/react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

// TODO: Replace with real results from API
const fakeResults = ["file number 1", "scaryBadFile", "not_a_w0rm.exe"];

export function GlobalSearch() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get("query");
  const [searchString, setSearchString] = useState(query || null);

  useEffect(() => {
    if (location.pathname) {
      setSearchString(query || "");
    }
  }, [query, location.pathname]);

  return (
    <Box
      component={Form}
      method="get"
      action="/search"
      width="236px"
      margin="0"
    >
      <Autocomplete
        freeSolo
        options={fakeResults}
        value={searchString}
        onChange={(_, value) => setSearchString(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Search"
            name="query"
            variant="standard"
            size="small"
            type="text"
          />
        )}
      />
    </Box>
  );
}
