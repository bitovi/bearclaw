import type { PortableTextBlock } from "@portabletext/types";
import { getClient } from "../getClient";
import { toPlainText } from "@portabletext/react";
import Mustache from "mustache";

type EmailTemplate = {
  _id: string;
  key: string;
  subject: string;
  body: PortableTextBlock[];
};

function isEmailTemplate(copy: any): copy is EmailTemplate {
  return copy?._id === "emailTemplate";
}

async function fetchEmailTemplate(key: string) {
  try {
    const emailTemplateQuery = `*[_id == "emailTemplate"][0]{...}`;
    const emailTemplate = await getClient().fetch<EmailTemplate | null>(
      emailTemplateQuery
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
  const emailTemplate = await fetchEmailTemplate(key);

  return {
    subject: Mustache.render(
      emailTemplate?.subject ? emailTemplate.subject : fallbackSubject,
      variables
    ),
    html: Mustache.render(
      emailTemplate?.body ? toPlainText(emailTemplate.body) : fallbackBody,
      variables
    ),
  };
}
