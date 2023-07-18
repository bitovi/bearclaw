import Box from "@mui/material/Box";
import { PageHeaderText } from "./PageHeaderText";
import Stack from "@mui/material/Stack";

type Props = {
  headline: string;
  description: string;
  children?: React.ReactNode;
};

export function PageHeader({ headline, description, children }: Props) {
  return (
    <Stack direction={{ xs: "column", lg: "row" }} gap={{ xs: 2, lg: 0 }}>
      <Box flex="1">
        <PageHeaderText headline={headline} description={description} />
      </Box>
      <Box>{children}</Box>
    </Stack>
  );
}
