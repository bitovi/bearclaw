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
    <Box display="flex" justifyContent="center">
      <Box maxWidth="600px" width="100%">
        <Typography
          component="h2"
          fontWeight="300"
          fontSize={{ xs: "1.8rem", sm: "2.4rem", md: "6rem" }}
          textAlign="center"
        >
          Profile Builder
        </Typography>
        <Box>
          <Stepper activeStep={activeStep + 1} alternativeLabel>
            <Step key="register">
              <StepLabel>Register Account</StepLabel>
            </Step>
            {questions.map((section) => (
              <Step key={section.title}>
                <StepLabel>{section.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Form method="post" action="/onboarding">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Box display="flex" overflow="hidden" width="100%" minWidth="100%">
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
                  <Typography
                    my={4}
                    fontSize={{ xs: "1rem", sm: "1.1rem", md: "1.3rem" }}
                    fontWeight="500"
                  >
                    {step.description}
                  </Typography>
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
            </Box>
            <Box mt={2} display="flex" justifyContent="space-between">
              <ButtonLink to="/home">Skip</ButtonLink>
              <Box display="flex" gap={2}>
                <Button
                  type="button"
                  disabled={activeStep <= 0}
                  variant="outlined"
                  onClick={() => setActiveStep((prev) => prev - 1)}
                >
                  Previous
                </Button>
                {activeStep === questions.length - 1 ? (
                  <Button type="submit" key="submit" variant="contained">
                    Submit
                  </Button>
                ) : (
                  <Button
                    type="button"
                    key="next"
                    variant="contained"
                    onClick={() => setActiveStep((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Form>
        </Box>
      </Box>
    </Box>
  );
}
