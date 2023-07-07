import { Box, Stack, Step, Stepper } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import { useState } from "react";
import type { AuthImages } from "~/routes/_auth/types";

export function Carousel({
  images = [],
}: {
  images: AuthImages["imageURLs"] | undefined;
}) {
  const [activeStep, setActiveStep] = useState(0);

  if (!images.length) return null;
  return (
    <Box>
      <Stack direction="row" sx={{ overflow: "hidden", paddingBottom: 3 }}>
        {images.map((img, i) => {
          return (
            <Box
              key={img.key}
              height="100%"
              width="100%"
              sx={{
                transition:
                  "transform 0.4s cubic-bezier(0.280, 0.840, 0.420, 1)",
                transform: `translateX(${activeStep * -100}%)`,
                flexShrink: 0,
              }}
            >
              <img height="auto" width="auto" src={img.url} alt={img.altText} />
            </Box>
          );
        })}
      </Stack>

      {images.length > 1 && (
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
                last={i + 1 === images.length}
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
      )}
    </Box>
  );
}
