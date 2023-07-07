import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { ButtonLink } from "~/components/buttonLink/ButtonLink";

export function NoResults() {
  return (
    <Stack height="100%" justifyContent="center" paddingBottom={2}>
      <Stack alignItems="center" gap={2}>
        <Skeleton
          animation={false}
          variant="rectangular"
          width="100px"
          height="100px"
          sx={{ display: "flex" }}
          component={Box}
          justifyContent={"center"}
          alignItems="center"
          borderRadius="32px"
        >
          <Typography component="span" visibility={"visible"}>
            Graphic
          </Typography>
        </Skeleton>
        <Typography variant="h5" color="text.primary">
          Sorry, no results found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We couldn't find what you are looking for
        </Typography>
        <ButtonLink
          variant="buttonMedium"
          to={"/dashboard"}
          sx={{
            "&:hover": { backgroundColor: "#FFF" },
            "&:focus": { backgroundColor: "#FFF" },
            color: "primary.main",
          }}
        >
          <KeyboardArrowLeftIcon />
          Go back to Dashboard
        </ButtonLink>
      </Stack>
    </Stack>
  );
}
