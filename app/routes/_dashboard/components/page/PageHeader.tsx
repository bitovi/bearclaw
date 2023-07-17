import Box from "@mui/material/Box";
import { PageHeaderText } from "./PageHeaderText";

type Props = {
  headline: string;
  description: string;
  children?: React.ReactNode;
};

export function PageHeader({ headline, description, children }: Props) {
  return (
    <Box display="flex">
      <Box flex="1">
        <PageHeaderText headline={headline} description={description} />
      </Box>
      <Box>{children}</Box>
    </Box>
  );
}
