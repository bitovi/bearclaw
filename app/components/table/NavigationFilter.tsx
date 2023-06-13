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
import { useRef } from "react";
import type { DropdownOption } from "./Table";
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

  const refTimer = useRef<NodeJS.Timeout | null>(null);

  const debounceFilterQuery = ({
    searchString,
    searchField,
  }: {
    searchString?: string | undefined;
    searchField?: string | undefined;
  }) => {
    const toSearchString =
      searchString === "" || !!searchString
        ? searchString
        : _searchString || "";

    const toSearchField =
      searchField === "" || !!searchField ? searchField : _searchField || "";

    const updatedSearchParams = buildNewSearchParams(searchParams, {
      filter: `contains(${toSearchField},${toSearchString})`,
    });

    if (!refTimer.current) {
      refTimer.current = setTimeout(
        () => navigate(`./?${updatedSearchParams}`),
        500
      );
    } else {
      clearTimeout(refTimer.current);
      refTimer.current = setTimeout(
        () => navigate(`./?${updatedSearchParams}`),
        500
      );
    }
  };

  return {
    searchField: _searchField,
    searchString: _searchString,
    debounceFilterQuery,
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
  const { searchField, searchString, debounceFilterQuery } = useFiltering();

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
            onChange={({ target }) =>
              debounceFilterQuery({ searchString: target.value })
            }
            label={searchLabel}
            defaultValue={searchString || ""}
            sx={{ minWidth: "200px" }}
          />
          {dropdownOptions.length && (
            <FormControl fullWidth>
              <InputLabel id={`filter-${dropdownLabel}-select`}>
                {dropdownLabel}
              </InputLabel>
              <Select
                onChange={({ target }) =>
                  debounceFilterQuery({ searchField: target.value })
                }
                labelId={`filter-${dropdownLabel}-select-label`}
                id={`filter-${dropdownLabel}-select`}
                value={
                  dropdownOptions.find((r) => r.value === searchField)?.value ||
                  ""
                }
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
          )}
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </Form>
  );
}
