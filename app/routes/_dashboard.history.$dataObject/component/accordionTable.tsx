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
