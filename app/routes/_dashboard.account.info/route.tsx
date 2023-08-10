import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getUser } from "~/session.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { rangeToText } from "~/routes/_auth._sidebar.onboarding/data.server";
import { FormCard } from "~/components/formCard";
import { fetchQuestions } from "~/services/sanity/copy/questions";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  if (!user) {
    return json(
      {
        success: false,
        accountInfo: null,
        accountQuestions: null,
        error: "You must be logged in to view this page.",
      },
      {
        status: 401,
      }
    );
  }
  const { accountQuestionsCopy } = await fetchQuestions();

  return json(
    {
      success: true,
      accountQuestions: accountQuestionsCopy,
      accountInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailSecondary: user.emailSecondary,
        phone: user.phone,
        companyName: user.companyName,
        levelOfExperience: rangeToText(user.experienceMin, user.experienceMax),
        teamSize: rangeToText(user.teamSizeMin, user.teamSizeMax),
        role: user.role,
      },
      error: "",
    },
    {
      status: 200,
    }
  );
}

export default function Route() {
  const { accountInfo, error, accountQuestions } =
    useLoaderData<typeof loader>();
  if (error) {
    return <Box>{error}</Box>;
  }

  const name =
    !accountInfo?.firstName && !accountInfo?.lastName
      ? ""
      : ` ${accountInfo.firstName} ${accountInfo.lastName}`;

  return (
    <Box>
      <Box paddingLeft={2} paddingBottom={2}>
        <Typography variant="h5">Hello{name},</Typography>
        <Typography variant="body2" color="text.secondary">
          Update your personal details here
        </Typography>
      </Box>

      <Stack gap={2}>
        {accountQuestions?.questionList.map((q, i) => {
          return (
            <FormCard
              action="/onboarding"
              key={`question-${i}`}
              question={q}
              submitText={"Save"}
              formData={accountInfo}
              redirectTo="/account"
            />
          );
        })}
      </Stack>
    </Box>
  );
}
