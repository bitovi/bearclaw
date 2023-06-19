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
import { Form } from "@remix-run/react";
import type { DropdownOption } from "./Table";
import { useFiltering } from "~/hooks/useFiltering";

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
