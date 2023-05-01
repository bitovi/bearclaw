import { Onboarding } from "~/routes/onboarding/components/Onboarding";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  return Array.from(formData).reduce(
    (acc: Record<string, string>, [key, value]) => {
      return {
        ...acc,
        [key]: value.toString(),
      };
    },
    {}
  );
}

export const meta: V2_MetaFunction = () => [{ title: "Onboarding" }];

export default function Route() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Onboarding
        response={
          actionData
            ? {
                success: true,
                data: actionData,
              }
            : undefined
        }
      />
    </div>
  );
}
