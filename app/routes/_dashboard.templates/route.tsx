import { useLoaderData } from "@remix-run/react";
import Box from "@mui/material/Box";

import { json } from "@remix-run/node";
import { Page, PageHeader } from "../_dashboard/components/page";
import { getClient } from "~/services/sanity/getClient";
import type { EmailTemplate } from "~/services/sanity/emailTemplates/renderEmailFromTemplate";
import { Accordion, AccordionSummary } from "@mui/material";
import { toPlainText } from "@portabletext/react";

export async function loader({ request }: { request: Request }) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Not found");
  }
  const templates = await getClient().fetch<EmailTemplate[]>(
    `*[_type == "emailTemplate" && key in ["mfaTokenVerification", "passwordReset"]] | order(key asc) []`
  );
  return json({ templates });
}

export default function Route() {
  const { templates } = useLoaderData<typeof loader>();

  return (
    <Page>
      <PageHeader headline="Email templates" description="Email templates" />
      <Box>
        {templates?.map((template) => (
          <Accordion key={template._id}>
            <AccordionSummary>{template.key}</AccordionSummary>
            <Box>
              <Box>Subject: {template.subject}</Box>
              <Box>{toPlainText(template.body)}</Box>
            </Box>
          </Accordion>
        ))}
      </Box>
    </Page>
  );
}
