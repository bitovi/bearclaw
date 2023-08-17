import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { ButtonLink } from "~/components/buttonLink/ButtonLink";
import { usePageCopy } from "~/routes/_dashboard/copy";

export function NoResults() {
  const copy = usePageCopy("search");
  const noResultsImage = copy?.images?.noResultsFound;

  return (
    <Stack height="100%" justifyContent="center" paddingY={8}>
      <Stack alignItems="center" gap={2}>
        {noResultsImage && (
          <Box width="60%" maxWidth="480px">
            <img
              height="auto"
              width="100%"
              src={noResultsImage.url}
              alt={noResultsImage.altText}
            />
          </Box>
        )}
        <Typography variant="h5" color="text.primary">
          {copy?.content?.noResultsHeadline || "No results found"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {copy?.content?.noResultsDetails ||
            "Please check your query and try again."}
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
