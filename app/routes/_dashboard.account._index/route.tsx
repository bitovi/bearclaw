import { Box, Stack, Typography } from "@mui/material";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getUser } from "~/session.server";
import { json } from "@remix-run/node";
import { getOwnerOrganization } from "~/models/organization.server";
import { retrieveOrganizationUser } from "~/models/organizationUsers.server";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import { rangeToText } from "~/routes/_auth._sidebar.onboarding/data.server";
import { FormCard } from "~/components/formCard";
import { fetchAccountQuestions } from "~/services/sanity/copy/accountQuestions";

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
  const organization = await getOwnerOrganization({ userId: user.id });

  if (!organization) {
    return json(
      {
        success: false,
        accountInfo: null,
        accountQuestions: null,
        error: "User's own organization not found",
      },
      {
        status: 401,
      }
    );
  }

  const organizationUser = await retrieveOrganizationUser({
    userId: user.id,
    organizationId: organization.id,
  });
  invariant(organizationUser, "User must have an organization to update");
  const accountQuestions = await fetchAccountQuestions();

  return json(
    {
      success: true,
      accountQuestions,
      accountInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailSecondary: user.emailSecondary,
        phone: user.phone,
        companyName: organization.name,
        levelOfExperience: rangeToText(
          organizationUser.experienceMin,
          organizationUser.experienceMax
        ),
        teamSize: rangeToText(
          organizationUser.teamSizeMin,
          organizationUser.teamSizeMax
        ),
        role: organizationUser.role,
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
