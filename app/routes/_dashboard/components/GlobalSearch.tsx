import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import { Form, useLocation, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { parseFilterParam } from "~/utils/parseFilterParam";

export function GlobalSearch() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const { _searchString } = parseFilterParam(searchParams.get("filter"));
  const [searchString, setSearchString] = useState(_searchString || "");

  useEffect(() => {
    if (location.pathname) {
      setSearchString(_searchString || "");
    }
  }, [_searchString, location.pathname])

  return (
    <Box component={Form} method="get" action="/search" width="200px">
      <input type="hidden" name="filter" value={`contains(search,${searchString})`} />
      <FormControl variant="standard" size="small" fullWidth>
        <InputLabel htmlFor="standard-adornment-password">Search</InputLabel>
        <Input
          id="standard-adornment-password"
          type="text"
          value={searchString}
          onChange={({ target }) => setSearchString(target.value)}
          placeholder="Search Files"
          startAdornment={<SearchIcon />}
          endAdornment={searchString ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={() => setSearchString("")}
              >
                <CloseTwoToneIcon />
              </IconButton>
            </InputAdornment>
          ) : null}
        />
      </FormControl>
    </Box>
  )
};
