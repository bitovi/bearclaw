import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Button } from "~/components/button";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Paper from "@mui/material/Paper";
import { Action, WorkflowIconEnum } from "../types";

export function ActionCard({
  options,
  type,
  title,
}: {
  title: string;
  type: keyof typeof WorkflowIconEnum;
  options: Action[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);

  const handleClick = (id: string) => {
    if (selection.includes(id)) {
      setSelection((prev) => prev.filter((sel) => sel !== id));
      return;
    }
    setSelection((prev) => prev.concat(id));
  };
  return (
    <Stack
      component={Paper}
      direction="row"
      justifyContent={"space-between"}
      onClick={() => setExpanded((prev) => !prev)}
      sx={{
        backgroundColor: expanded ? "#263238" : "unset",
        borderTopLeftRadius: expanded ? " 16px" : "80px",
        borderBottomLeftRadius: expanded ? " 16px" : "80px",
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        "& .MuiAccordion-root": {
          margin: 0,
        },
        "& .MuiPaper-root": {
          backgroundColor: "transparent",
        },
        marginY: 1,
      }}
    >
      <Stack flexGrow={1}>
        <Accordion
          disableGutters
          elevation={0}
          expanded={expanded}
          sx={{
            "&:before": {
              display: "none",
            },
            ".MuiAccordionSummary-root > .Mui-expanded": {
              transform: "none",
            },
          }}
        >
          <AccordionSummary
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Stack direction="row" alignItems="center">
              {expanded ? (
                <Box paddingRight={2} />
              ) : (
                <Box paddingRight={2}>{WorkflowIconEnum[type]}</Box>
              )}
              <Stack>
                <Typography
                  variant="subtitle1"
                  color={expanded ? "#FFFFFF" : "unset"}
                >
                  {title}
                </Typography>
                <Typography
                  variant="caption"
                  color={expanded ? "#FFFFFF" : "unset"}
                >
                  {type}
                </Typography>
              </Stack>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack component={FormControl} gap={1}>
              {options.map((opt) => {
                return (
                  <FormControlLabel
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClick(opt.id);
                    }}
                    key={opt.id}
                    value={opt.id}
                    control={
                      <Radio
                        color="secondary"
                        sx={{ color: expanded ? "#FFF" : "secondary" }}
                        checked={selection.includes(opt.id)}
                      />
                    }
                    label={
                      <Typography
                        variant="caption"
                        color={expanded ? "#FFFFFF" : "unset"}
                      >
                        {opt.description}
                      </Typography>
                    }
                  />
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>

      <Button
        sx={{
          backgroundColor: expanded ? "rgba(255, 255, 255, 0.12)" : "grey.300",
          "&:hover": {
            backgroundColor: expanded
              ? "rgba(255, 255, 255, 0.12)"
              : "grey.300",
          },
        }}
      >
        <DragIndicatorIcon
          sx={{
            color: expanded ? "black" : "grey.600",
            fontSize: "40px",
          }}
        />
      </Button>
    </Stack>
  );
}
