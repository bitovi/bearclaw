import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useSearchParams } from "@remix-run/react";

import { ButtonLink } from "../buttonLink/ButtonLink";
import { Box, MenuItem, Select } from "@mui/material";
import { buildNewSearchParams } from "~/utils/buildNewSearchParams";

function usePagination({
  totalItems,
  perPageOptions = [10, 25, 50],
}: {
  totalItems: number;
  perPageOptions?: Array<number>;
}) {
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "10");
  const totalPages = Math.ceil(totalItems / perPage);
  const startItemIndex = (currentPage - 1) * perPage + 1;
  const endItemIndex =
    currentPage * perPage > totalItems ? totalItems : currentPage * perPage;
  const firstPageLink =
    currentPage === 1
      ? undefined
      : `?${buildNewSearchParams(searchParams, { perPage, page: 1 })}`;
  const lastPageLink =
    currentPage === totalPages
      ? undefined
      : `?${buildNewSearchParams(searchParams, { perPage, page: totalPages })}`;
  const prevPageLink =
    currentPage <= 1
      ? undefined
      : `?${buildNewSearchParams(searchParams, {
          perPage,
          page: currentPage - 1,
        })}`;
  const nextPageLink =
    currentPage >= totalPages
      ? undefined
      : `?${buildNewSearchParams(searchParams, {
          perPage,
          page: currentPage + 1,
        })}`;

  const optionLinks = perPageOptions.map((option) => ({
    key: option,
    value: option,
    link: `?${buildNewSearchParams(searchParams, {
      perPage: option,
      page: 1,
    })}`,
  }));

  return {
    currentPage,
    perPage,
    totalPages,
    startItemIndex,
    endItemIndex,
    perPageOptions,
    optionLinks,
    firstPageLink,
    lastPageLink,
    prevPageLink,
    nextPageLink,
  };
}
export function LinkPagination({
  totalItems,
  perPageOptions = [10, 25, 50],
}: {
  totalItems: number;
  perPageOptions?: Array<number>;
}) {
  const {
    perPage,
    startItemIndex,
    endItemIndex,
    optionLinks,
    firstPageLink,
    lastPageLink,
    prevPageLink,
    nextPageLink,
  } = usePagination({ totalItems, perPageOptions });

  return (
    <Toolbar sx={{ display: "flex", justifyContent: "right", gap: 2 }}>
      <Typography>Rows per page:</Typography>
      <Select value={perPage} variant="standard" aria-label="Rows per page">
        {optionLinks.map(({ key, value, link }) => (
          <MenuItem key={key} value={value} sx={{ padding: 0 }}>
            <Typography
              component={value === perPage ? "div" : Link}
              to={link}
              aria-label={`Show ${value} per page`}
              height="100%"
              width="100%"
              padding={1}
              textAlign="center"
              color="grey.800"
              sx={{
                textDecoration: "none",
              }}
            >
              {value}
            </Typography>
          </MenuItem>
        ))}
      </Select>
      <Typography>
        {startItemIndex}-{endItemIndex} of {totalItems}
      </Typography>
      <Box
        display="flex"
        sx={{
          "div, div:hover, a, a:hover, :visited, a:focus": {
            color: "grey.800",
          },
        }}
      >
        <ButtonLink
          aria-label="first page"
          to={firstPageLink}
          sx={{ minWidth: "32px" }}
        >
          <KeyboardDoubleArrowLeftIcon />
        </ButtonLink>
        <ButtonLink
          aria-label="previous page"
          to={prevPageLink}
          sx={{ minWidth: "32px" }}
        >
          <KeyboardArrowLeftIcon />
        </ButtonLink>
        <ButtonLink
          aria-label="next page"
          to={nextPageLink}
          sx={{ minWidth: "32px" }}
        >
          <KeyboardArrowRightIcon />
        </ButtonLink>
        <ButtonLink
          aria-label="last page"
          to={lastPageLink}
          disabled={!!lastPageLink}
        >
          <KeyboardDoubleArrowRightIcon />
        </ButtonLink>
      </Box>
    </Toolbar>
  );
}
