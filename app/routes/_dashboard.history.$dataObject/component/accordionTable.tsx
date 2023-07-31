import { AccordionDetails } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function AccordionTable({
  heading,
  subheading,
  children,
}: {
  heading: string;
  subheading: string;
  children?: JSX.Element;
}) {
  return (
    <Accordion
      sx={{
        marginY: 4,
        "&:before": {
          display: "none",
        },
        width: "100%",
      }}
      elevation={0}
      defaultExpanded={true}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack>
          <Typography variant="h6">{heading}</Typography>
          <Typography variant="body2" color="text.secondary">
            {subheading}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
