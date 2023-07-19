import { url } from "gravatar";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useOptionalUser } from "~/utils";
import { Logo } from "./logo";
import { GlobalSearch } from "./GlobalSearch";

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
          flex="1"
          direction="row"
          gap={2}
          alignItems="center"
        >
          <Box flex="1">
            <GlobalSearch />
          </Box>
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
