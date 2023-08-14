import type { PortableTextBlock } from "@portabletext/types";
import { toHTML } from "@portabletext/to-html";
import Mustache from "mustache";
import { getClient } from "../getClient";

export type EmailTemplate = {
  _id: string;
  key: string;
  subject: string;
  body: PortableTextBlock[];
};

function isEmailTemplate(copy: any): copy is EmailTemplate {
  return copy?._type === "emailTemplate";
}

async function fetchEmailTemplate(key: string) {
  try {
    const emailTemplates = await getClient().fetch<EmailTemplate[] | null>(
      `*[_type == "emailTemplate"]`
    );
    const emailTemplate = emailTemplates?.find(
      (template) => template.key === key
    );
    if (!isEmailTemplate(emailTemplate)) {
      throw new Error(`Email template not found for key: ${key}`);
    }

    return emailTemplate;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function renderEmailFromTemplate({
  key,
  fallbackBody,
  fallbackSubject,
  variables,
}: {
  key: string;
  fallbackBody: string;
  fallbackSubject: string;
  variables: Record<string, string>;
}) {
  const emailTemplate = process.env.EMAIL_USE_DEV
    ? null
    : await fetchEmailTemplate(key);

  return {
    subject: Mustache.render(
      emailTemplate?.subject ? emailTemplate.subject : fallbackSubject,
      variables
    ),
    html: Mustache.render(
      emailTemplate?.body ? toHTML(emailTemplate.body) : fallbackBody,
      variables
    ),
  };
}
