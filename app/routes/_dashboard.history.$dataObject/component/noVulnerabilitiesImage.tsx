import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { PageCopyKeyed } from "~/routes/_dashboard/types";

export function NoVulnerabilitiesImage({
  image,
}: {
  image?: PageCopyKeyed["images"][number];
}) {
  if (!image) return null;
  return (
    <Stack
      flexGrow={1}
      flex={1}
      alignItems={{ xs: "center", md: "flex-end" }}
      justifyContent={{ xs: "flex-end" }}
    >
      <Box
        height={{ xs: "unset", lg: "75%", xl: "100%" }}
        width={{ xs: "75%", lg: "unset" }}
        paddingTop={{ xs: 2, md: "unset" }}
        minWidth="478px"
        component="img"
        src={image.url}
        alt={image.altText}
        draggable={false}
      />
    </Stack>
  );
}
