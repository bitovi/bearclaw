import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFetcher } from "@remix-run/react";
import { Dropdown, TextInput } from "~/components/input";
import type { action as onboardingAction } from "~/routes/_auth._sidebar.onboarding/route";
import type { Question } from "~/services/sanity/copy/questions/types";

export function FormCard<
  FormData extends Record<string, string | number | undefined | null> | null
>({
  question,
  submitText,
  action,
  redirectTo,
  formData,
}: {
  question: Question;
  submitText: string;
  action?: string;
  redirectTo?: string;
  formData?: FormData;
}) {
  const fetcher = useFetcher<typeof onboardingAction>();

  return (
    <Card variant="outlined" sx={{ padding: 2, paddingBottom: 0 }}>
      <fetcher.Form action={action || ""} method={"POST"}>
        {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )}
        <Box paddingBottom={2}>
          <Typography variant="h6" color="text.secondary">
            {question.header}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {question.information}
          </Typography>
        </Box>

        <Stack
          display={question.questionFields.length > 1 ? "grid" : "block"}
          gridTemplateColumns={
            question.questionFields.length > 1
              ? { xs: "1fr", md: "repeat(2, 1fr)" }
              : {}
          }
          gap={2}
        >
          {question.questionFields.map((formQuestion) => {
            return (
              <Box key={formQuestion.name}>
                {(formQuestion.questionType === "text" ||
                  formQuestion.questionType === "tel" ||
                  formQuestion.questionType === "email") && (
                  <TextInput
                    defaultValue={formData?.[formQuestion.name]}
                    fullWidth
                    placeholder={formQuestion.placeholder}
                    type={formQuestion.questionType}
                    label={formQuestion.label}
                    name={formQuestion.name}
                    required={formQuestion.required}
                    inputProps={{
                      pattern: formQuestion.pattern,
                    }}
                    disabled={formQuestion.disabled || fetcher.state !== "idle"}
                  />
                )}
                {formQuestion.questionType === "select" && (
                  <Dropdown
                    defaultValue={formData?.[formQuestion.name]}
                    fullWidth
                    variant="filled"
                    labelPosition={10}
                    label={formQuestion.label}
                    name={formQuestion.name}
                    required={formQuestion.required}
                    options={formQuestion.optionList}
                    disabled={formQuestion.disabled || fetcher.state !== "idle"}
                  />
                )}
              </Box>
            );
          })}
        </Stack>

        <Stack
          padding={1}
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Button
            type="submit"
            key="submit"
            variant="text"
            disabled={
              !!question.questionFields.find((q) => q.disabled) ||
              fetcher.state !== "idle"
            }
          >
            {submitText}
          </Button>
        </Stack>
      </fetcher.Form>
    </Card>
  );
}
