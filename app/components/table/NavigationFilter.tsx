import {
  Toolbar,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import { TextInput } from "../input";
import { Form, useNavigate, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DropdownOption } from "./Table";
import { useDebounceApiCall } from "~/hooks/useDebounceApiCall";
import { buildNewSearchParams } from "~/utils/buildNewSearchParams";

function parseFilterParam(filterParam: string | null) {
  // regex to return values within "contains(______,______)"
  // 0 index will be field, 1 index will be value
  const result = filterParam?.match(/\((.*?)\)/)?.[1].split(",");
  return {
    _searchField: result?.[0],
    _searchString: result?.[1],
  };
}

function useFiltering() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { _searchField, _searchString } = parseFilterParam(
    searchParams.get("filter")
  );
  const [searchString, setSearchString] = useState(_searchString || "");
  const [searchField, setSearchField] = useState(_searchField || "");

  const updatedSearchParams = useMemo(() => {
    return buildNewSearchParams(searchParams, {
      filter: `contains(${searchField},${searchString})`,
    });
  }, [searchString, searchField, searchParams]);

  const handleSearchString = (val: string) => {
    setSearchString(val);
  };

  const handleSearchField = (val: string) => {
    setSearchField(val);
  };

  const apiCall = useCallback(() => {
    // This navigation will fire a fresh API call from the '/history' loader
    navigate(`./?${updatedSearchParams}`);
  }, [updatedSearchParams, navigate]);

  useEffect(() => {
    return () => {
      console.log("USE FILTERING IS UNMOUNTING");
    };
  }, []);

  useDebounceApiCall({
    apiCall,
  });

  return {
    searchField,
    searchString,
    handleSearchString,
    handleSearchField,
  };
}

export function NavigationFilter({
  dropdownOptions: _dropdownOptions,
  dropdownLabel,
  searchLabel,
}: {
  dropdownOptions: DropdownOption[];
  dropdownLabel: string;
  searchLabel: string;
}) {
  const { searchField, searchString, handleSearchString, handleSearchField } =
    useFiltering();

  const dropdownOptions = [{ value: "", label: "Select a Field" }].concat(
    _dropdownOptions
  );

  return (
    <Form action="" method="get">
      <Toolbar sx={{ justifyContent: "flex-start" }}>
        <Stack direction="row" gap={2}>
          <TextInput
            name={searchLabel}
            inputProps={{
              sx: { maxHeight: "20px" },
            }}
            onChange={({ target }) => handleSearchString(target.value)}
            label={searchLabel}
            value={searchString}
            sx={{ minWidth: "200px" }}
          />
          <FormControl fullWidth>
            <InputLabel id={`filter-${dropdownLabel}-select`}>
              {dropdownLabel}
            </InputLabel>
            <Select
              onChange={({ target }) => handleSearchField(target.value)}
              labelId={`filter-${dropdownLabel}-select-label`}
              id={`filter-${dropdownLabel}-select`}
              value={searchField}
              displayEmpty
              label={dropdownLabel} // To ensure MUI notched outline styling, we still need to pass a value to the label prop
            >
              {dropdownOptions.map((opt) => {
                return (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </Form>
  );
}
