import Box from "@mui/material/Box";
import { PageHeaderText } from "./PageHeaderText";
import Stack from "@mui/material/Stack";

type Props = {
  headline: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  detailPage?: boolean;
};

export function PageHeader({
  headline,
  description,
  children,
  detailPage,
}: Props) {
  return (
    <Stack direction={{ xs: "column", lg: "row" }} gap={{ xs: 2, lg: 0 }}>
      <Box flex="1">
        <PageHeaderText
          headline={headline}
          description={description}
          detailPage={detailPage}
        />
      </Box>
      <Box>{children}</Box>
    </Stack>
  );
}
