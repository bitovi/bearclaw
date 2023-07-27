import { Form, useNavigation } from "@remix-run/react";
import { Button } from "../../../components/button";
import { TextInput, Dropdown } from "../../../components/input";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useState } from "react";
import { ButtonLink } from "~/components/buttonLink/ButtonLink";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Question } from "~/services/sanity/copy/questions/types";
import { useParentFormCopy } from "~/routes/_auth/copy";
import { ButtonLoader } from "~/components/buttonLoader";

type Props = {
  redirectTo?: string;
  questions: Question[];
};

export function Onboarding({ redirectTo, questions }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const copy = useParentFormCopy();
  const navigation = useNavigation();

  return (
    <>
      <Stack alignItems="flex-start" gap={2} paddingBottom={2}>
        <Typography variant="body2" color="text.secondary">
          {copy?.onboardingSubHeader || "This will take less than 5 minutes."}
        </Typography>
        <Typography variant="h2" fontWeight="300" textAlign="center">
          {copy?.profileBuilder || "Profile Builder"}
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
            <StepLabel>
              {copy?.profileBuilderStep1Label || "Register Account"}
            </StepLabel>
          </Step>
          {questions.map((section) => (
            <Step key={section.header}>
              <StepLabel>{section.header}</StepLabel>
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
                  key={step.header}
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
                      {step.information}
                    </Typography>
                  </Stack>

                  <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "1fr", md: "repeat(2, 1fr)" }}
                    rowGap={2}
                    columnGap={1}
                  >
                    {step.questionFields.map((formQuestion, i) => {
                      return (
                        <Box key={formQuestion.name}>
                          {(formQuestion.questionType === "text" ||
                            formQuestion.questionType === "tel" ||
                            formQuestion.questionType === "email") && (
                            <TextInput
                              fullWidth
                              tabIndex={
                                activeStep === stepIndex ? undefined : -1
                              }
                              placeholder={formQuestion.placeholder}
                              type={formQuestion.questionType}
                              label={formQuestion.label}
                              name={formQuestion.name}
                              required={formQuestion.required}
                              inputProps={{
                                pattern: formQuestion.pattern,
                              }}
                              disabled={formQuestion.disabled}
                            />
                          )}
                          {formQuestion.questionType === "select" && (
                            <Dropdown
                              fullWidth
                              labelPosition={10}
                              label={formQuestion.label}
                              name={formQuestion.name}
                              required={formQuestion.required}
                              options={formQuestion.optionList}
                              defaultValue=""
                              disabled={formQuestion.disabled}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </Stack>
            <Box mt={2} display="flex" justifyContent="space-between">
              <ButtonLink to={redirectTo ? redirectTo : "/dashboard"}>
                {copy?.profileBuilderSkipButton || "Skip"}
              </ButtonLink>
              <Box display="flex" gap={2}>
                {activeStep <= 0 ? null : (
                  <Button
                    type="button"
                    variant="buttonLargeOutlined"
                    onClick={() => setActiveStep((prev) => prev - 1)}
                  >
                    {copy?.profileBuilderPreviousButton || "Previous"}
                  </Button>
                )}
                {activeStep === questions.length - 1 ? (
                  <ButtonLoader
                    type="submit"
                    variant="buttonLarge"
                    loading={
                      navigation.state === "submitting" ||
                      navigation.state === "loading"
                    }
                  >
                    {copy?.profileBuilderSubmitButton || "Finish Profile"}
                  </ButtonLoader>
                ) : (
                  <Button
                    type="button"
                    key="next"
                    variant="buttonLarge"
                    onClick={() => setActiveStep((prev) => prev + 1)}
                  >
                    {copy?.profileBuilderNextButton || "Continue"}
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
