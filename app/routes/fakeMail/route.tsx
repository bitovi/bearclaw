import { useLoaderData } from "@remix-run/react";
import { listMail } from "~/services/mail/listMail";
import Box from "@mui/material/Box";
import { json } from "@remix-run/server-runtime";

export async function loader() {
  if (!process.env.EMAIL_USE_DEV) {
    throw json(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const mail = await listMail();
  return json({ mail });
}

export default function DashboardFakeMailPage() {
  const { mail } = useLoaderData<typeof loader>();

  return (
    <Box p={4}>
      <h1>Fake Mail</h1>
      {mail?.length ? (
        mail.map((mail) => (
          <Box
            key={mail.id}
            display="flex"
            gap={4}
            border={1}
            p={4}
            data-testid={mail.to}
          >
            <div>
              <div>
                <i>Sent:</i> {mail.createdAt}
              </div>
              <div>
                <i>To:</i> {mail.to}
              </div>
              <div>
                <i>From:</i> {mail.from}
              </div>
            </div>
            <Box flex="1" borderLeft="1px" paddingLeft={4} lineHeight={1.2}>
              <p>
                <i>Subject:</i> {mail.subject}
              </p>
              {mail.text ? (
                <p>{mail.text}</p>
              ) : (
                <Box
                  sx={{ "> p": { marginBlockStart: 1, marginBlockEnd: 1 } }}
                  dangerouslySetInnerHTML={{ __html: mail.html || "" }}
                />
              )}
            </Box>
          </Box>
        ))
      ) : (
        <p>No mail found.</p>
      )}
    </Box>
  );
}
