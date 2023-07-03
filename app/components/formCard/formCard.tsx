import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { Dropdown, TextInput } from "~/components/input";
import type { Question } from "~/routes/_auth._sidebar.onboarding/questions";
import type { action as onboardingAction } from "~/routes/_auth._sidebar.onboarding/route";

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
            {question.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {question.description}
          </Typography>
        </Box>

        <Stack
          display={question.questions.length > 1 ? "grid" : "block"}
          gridTemplateColumns={
            question.questions.length > 1
              ? { xs: "1fr", md: "repeat(2, 1fr)" }
              : {}
          }
          gap={2}
        >
          {question.questions.map((formQuestion) => (
            <div key={formQuestion.name}>
              {formQuestion.type === "text" && (
                <TextInput
                  defaultValue={formData?.[formQuestion.name]}
                  fullWidth
                  label={formQuestion.label}
                  name={formQuestion.name}
                  required={formQuestion.required}
                  disabled={formQuestion.disabled || fetcher.state !== "idle"}
                />
              )}
              {formQuestion.type === "select" && (
                <Dropdown
                  defaultValue={formData?.[formQuestion.name]}
                  fullWidth
                  variant="filled"
                  labelPosition={10}
                  label={formQuestion.label}
                  name={formQuestion.name}
                  required={formQuestion.required}
                  options={formQuestion.options}
                  disabled={formQuestion.disabled || fetcher.state !== "idle"}
                />
              )}
            </div>
          ))}
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
            disabled={question.disabled || fetcher.state !== "idle"}
          >
            {submitText}
          </Button>
        </Stack>
      </fetcher.Form>
    </Card>
  );
}
