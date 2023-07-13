import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Breadcrumbs } from "./Breadcrumbs";

type Props = {
  headline: string;
  description: string;
};

export function PageHeaderText({ headline, description }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap="8px">
      <Breadcrumbs />
      <Typography variant="h3" component="h1">
        {headline}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
