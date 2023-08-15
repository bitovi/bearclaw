import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { PageCopyKeyed } from "~/routes/_dashboard/types";

export function CveStatusImage({
  image,
  displayText,
  maxWidth,
}: {
  image?: PageCopyKeyed["images"][number];
  displayText?: string;
  maxWidth?: string;
}) {
  if (!image) return null;
  return (
    <Stack
      justifyContent="center"
      alignItems={"center"}
      flex={1}
      flexGrow={1}
      paddingTop={4}
    >
      <Box
        width="100%"
        maxWidth={maxWidth || "672px"}
        component="img"
        src={image.url}
        alt={image.altText}
        draggable={false}
      />
      {displayText && (
        <Typography variant="h5" color="text.secondary">
          {displayText}
        </Typography>
      )}
    </Stack>
  );
}
