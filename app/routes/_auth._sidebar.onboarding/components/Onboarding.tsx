import { Form } from "@remix-run/react";
import { Button } from "../../../components/button";
import { TextInput, Dropdown } from "../../../components/input";
import { questions } from "../questions";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useState } from "react";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  response?: {
    success: boolean;
    data: Record<string, string>;
  };
  redirectTo?: string;
};

export function Onboarding({ response, redirectTo }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <Stack alignItems="flex-start" gap={2} paddingBottom={2}>
        <Typography variant="body2" color="text.secondary">
          This will take less than 5 minutes.
        </Typography>
        <Typography variant="h2" fontWeight="300" textAlign="center">
          Profile Builder
        </Typography>
        <Stepper
          activeStep={activeStep + 1}
          sx={{
            width: "100%",
            "& :first-child": {
              paddingLeft: 0,
            },
          }}
        >
          <Step key="register">
            <StepLabel>Register Account</StepLabel>
          </Step>
          {questions.map((section) => (
            <Step key={section.title}>
              <StepLabel>{section.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>

      <Box>
        <Form method="post" action="/onboarding">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Box width="85%" margin="0 auto">
            <Stack
              direction="row"
              overflow="hidden"
              width="100%"
              minWidth="100%"
              paddingY={4}
            >
              {questions.map((step, stepIndex) => (
                <Box
                  key={step.title}
                  width="100%"
                  minWidth="100%"
                  sx={{
                    transition:
                      "transform 0.4s cubic-bezier(0.280, 0.840, 0.420, 1)",
                    transform: `translateX(${activeStep * -100}%)`,
                  }}
                >
                  <Stack
                    height={"60px"}
                    marginBottom={2}
                    justifyContent="center"
                  >
                    <Typography variant="body1" color="text.primary">
                      {step.description}
                    </Typography>
                  </Stack>

                  <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }}
                    rowGap={2}
                    columnGap={1}
                  >
                    {step.questions.map((question) => (
                      <div key={question.name}>
                        {question.type === "text" && (
                          <TextInput
                            tabIndex={activeStep === stepIndex ? undefined : -1}
                            fullWidth
                            label={question.label}
                            name={question.name}
                          />
                        )}
                        {question.type === "select" && (
                          <Dropdown
                            fullWidth
                            label={question.label}
                            name={question.name}
                            options={question.options}
                          />
                        )}
                      </div>
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
            <Box mt={2} display="flex" justifyContent="space-between">
              <ButtonLink to="/dashboard">Skip</ButtonLink>
              <Box display="flex" gap={2}>
                {activeStep <= 0 ? null : (
                  <Button
                    type="button"
                    variant="buttonLargeOutlined"
                    onClick={() => setActiveStep((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                )}
                {activeStep === questions.length - 1 ? (
                  <Button type="submit" key="submit" variant="buttonLarge">
                    Finish Profile
                  </Button>
                ) : (
                  <Button
                    type="button"
                    key="next"
                    variant="buttonLarge"
                    onClick={() => setActiveStep((prev) => prev + 1)}
                  >
                    Continue
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Form>
      </Box>
    </>
  );
}
