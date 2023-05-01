import { Form } from "@remix-run/react";
import { Button } from "../../../components/button";
import { Dropdown } from "../../../components/dropdown";
import { TextInput } from "../../../components/input";
import { questions } from "../questions";

type Props = {
  response?: {
    success: boolean;
    data: Record<string, string>;
  };
};

export function Onboarding({ response }: Props) {
  return (
    <div className="p-4">
      <h2 className="text-xl">Onboarding</h2>
      {response?.success ? (
        <div
          className="relative rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">
            {" "}
            Your onboarding form was submitted.
          </span>
          <pre>{JSON.stringify(response.data, null, 2)}</pre>
        </div>
      ) : (
        <Form method="post" action="/onboarding">
          <div className="flex p-4">
            {questions.map((section) => (
              <div key={section.sectionTitle} className="m-2 border p-2">
                <h3 className="mb-2">{section.sectionTitle}</h3>
                <div className="flex flex-col gap-2">
                  {section.questions.map((question) => (
                    <div key={question.name}>
                      {question.type === "text" && (
                        <TextInput
                          label={question.label}
                          name={question.name}
                        />
                      )}
                      {question.type === "select" && (
                        <Dropdown
                          label={question.label}
                          name={question.name}
                          options={question.options}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </div>
  );
}
