import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { PageCopyKeyed } from "~/routes/_dashboard/types";

export function CveStatusImage({
  image,
}: {
  image?: PageCopyKeyed["images"][number];
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
        maxWidth="672px"
        component="img"
        src={image.url}
        alt={image.altText}
        draggable={false}
      />
    </Stack>
  );
}
