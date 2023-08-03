import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Breadcrumbs } from "./Breadcrumbs";

type Props = {
  headline: React.ReactNode;
  description: React.ReactNode;
  detailPage?: boolean;
};

export function PageHeaderText({ headline, description, detailPage }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap="8px">
      <Breadcrumbs detailPage={detailPage} />
      <Typography variant="h3" component="h1">
        {headline}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
