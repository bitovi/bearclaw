import { Box, Stack, Step, StepLabel, Stepper } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import { useState } from "react";

export function Carousel({ images = [] }: { images: (() => JSX.Element)[] }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box>
      <Stack
        direction="row"
        width="320"
        height="210"
        sx={{ overflow: "hidden", paddingBottom: 4 }}
      >
        {images.map((N, i) => {
          return (
            <Box
              key={`image-${i}`}
              height="100%"
              width="100%"
              sx={{
                transition:
                  "transform 0.4s cubic-bezier(0.280, 0.840, 0.420, 1)",
                transform: `translateX(${activeStep * -100}%)`,
                flexShrink: 0,
              }}
            >
              <N />
            </Box>
          );
        })}
      </Stack>

      <Stepper
        alternativeLabel
        nonLinear
        activeStep={activeStep + 1}
        connector={null}
        sx={{ justifyContent: "center" }}
      >
        <Stack direction="row">
          {images.map((_section, i) => (
            <Step
              key={`step-${i}`}
              onClick={() => {
                setActiveStep(i);
              }}
            >
              {activeStep === i ? (
                <FiberManualRecordIcon sx={{ color: "secondary.main" }} />
              ) : (
                <FiberManualRecordOutlinedIcon
                  sx={{ color: "secondary.main" }}
                />
              )}
            </Step>
          ))}
        </Stack>
      </Stepper>
    </Box>
  );
}
