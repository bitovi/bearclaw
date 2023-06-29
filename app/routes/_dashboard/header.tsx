import { useOptionalUser } from "~/utils";
import Box from "@mui/material/Box";
import { url } from "gravatar";
import { Logo } from "./logo";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import { TextInput } from "~/components/input";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { useCallback, useState } from "react";
import { useDebounceApiCall } from "~/hooks/useDebounceApiCall";

const GlobalSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchString, setSearchString] = useState(
    searchParams.get("search") || ""
  );

  const apiCall = useCallback(() => {
    const queryParams = new URLSearchParams();
    queryParams.append("search", searchString);
    navigate(`/search?${queryParams}`);
  }, [searchString, navigate]);

  useDebounceApiCall({
    apiCall,
  });

  return (
    <TextInput
      name={"global-search"}
      value={searchString}
      onChange={({ target }) => setSearchString(target.value)}
      inputProps={{
        sx: { maxHeight: "5px" },
      }}
      label={"Search"}
      sx={{ minWidth: "200px" }}
    />
  );
};

export const Header = () => {
  const user = useOptionalUser();

  return (
    <AppBar position="static" component={"header"}>
      <Toolbar
        component={Stack}
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          paddingBottom: {
            xs: 2,
            sm: 0,
          },
        }}
      >
        <Box>
          <Logo />
        </Box>
        <Stack
          direction="row"
          gap={2}
          justifyContent="flex-end"
          alignItems="center"
        >
          <GlobalSearch />
          {user?.email && (
            <Box
              component="img"
              src={url(user?.email || "", { size: "32" }, true)}
              alt=""
              borderRadius="50%"
            />
          )}
          <Typography color="text.primary">
            {user?.firstName
              ? `${user.firstName} ${user.lastName}`
              : user?.email}
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
