import { useOptionalUser } from "~/utils";
import Box from "@mui/material/Box";
import { url } from "gravatar";
import { Logo } from "./logo";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import { TextInput } from "~/components/input";

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
          <TextInput
            name={"global-search"}
            inputProps={{
              sx: { maxHeight: "5px" },
            }}
            label={"Search"}
            sx={{ minWidth: "200px" }}
          />
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
