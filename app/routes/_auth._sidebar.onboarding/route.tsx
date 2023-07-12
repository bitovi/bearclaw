import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { getUser } from "~/session.server";
import { onboardUser } from "./data.server";
import type { OnboardingData } from "./types";
import { Onboarding } from "./components/Onboarding";

export async function loader({ request }: LoaderArgs) {
  return json({});
}

export async function action({ request }: ActionArgs) {
  const user = await getUser(request);
  if (!user) {
    return json(
      {
        success: false,
        error: "You must be logged in to submit this form.",
      },
      {
        status: 401,
      }
    );
  }

  const formData = await request.formData();
  const onboardingData: Partial<OnboardingData> = {
    firstName: formData.get("firstName")?.toString() || undefined,
    lastName: formData.get("lastName")?.toString() || undefined,
    emailSecondary: formData.get("emailSecondary")?.toString() || undefined,
    phone: formData.get("phone")?.toString() || undefined,
    role: formData.get("role")?.toString() || undefined,
    companyName: formData.get("companyName")?.toString() || undefined,
    levelOfExperience:
      formData.get("levelOfExperience")?.toString() || undefined,
    teamSize: formData.get("teamSize")?.toString() || undefined,
  };

  const response = await onboardUser(user, onboardingData);
  if (response) {
    const redirectTo = formData.get("redirectTo")?.toString();
    if (redirectTo) {
      throw redirect(redirectTo);
    }
    return json({
      success: true,
      data: response,
    });
  }
}

export const meta: V2_MetaFunction = () => [{ title: "Onboarding" }];

export default function Route() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <div>
      <Onboarding
        redirectTo={redirectTo || undefined}
        response={
          actionData
            ? {
                success: true,
                data: {},
              }
            : undefined
        }
      />
    </div>
  );
}
