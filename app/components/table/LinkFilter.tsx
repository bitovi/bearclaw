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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DropdownOption } from "./Table";

function buildNewSearchParams(
  searchParams: URLSearchParams,
  newValues: Record<string, string | number | null>
): string {
  const newSearchParams = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(newValues)) {
    if (value === null) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value.toString());
    }
  }
  return newSearchParams.toString();
}

function parseFilterParam(filterParam: string | null) {
  // regex to return values within "contains(______,______)"
  // 0 index will be field, 1 index will be value
  const result = filterParam?.match(/\((.*?)\)/)?.[1].split(",");
  return {
    _searchField: result?.[0],
    _searchString: result?.[1],
  };
}

function useDebounceApiCall<T>({
  delay,
  apiCall,
}: {
  delay?: number;
  apiCall: T extends Function ? T : never;
}) {
  const mountedRef = useRef(false);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (mountedRef.current) {
      timer = setTimeout(() => apiCall(), delay || 500);
    }
    mountedRef.current = true;

    return () => {
      clearTimeout(timer);
    };
  }, [delay, apiCall]);
}

function useFiltering(endpoint: string) {
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

  // TODO make this param more strongly typed w/ enum
  // TODO create defer logic w/ Suspense and table Skeleton that maintains search bar
  const handleSearchField = (val: string) => {
    setSearchField(val);
  };

  const apiCall = useCallback(() => {
    if (searchField && searchString) {
      navigate(`${endpoint}?${updatedSearchParams}`);
    }
  }, [searchField, searchString, updatedSearchParams, navigate]);

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

export function LinkFilter({
  dropdownOptions: _dropdownOptions,
  dropdownLabel,
  searchLabel,
  endpoint,
}: {
  dropdownOptions: DropdownOption[];
  dropdownLabel: string;
  searchLabel: string;
  endpoint: string;
}) {
  const { searchField, searchString, handleSearchString, handleSearchField } =
    useFiltering(endpoint);

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
