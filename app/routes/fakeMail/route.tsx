import { useLoaderData } from "@remix-run/react";
import { listMail } from "~/services/mail/listMail";

export async function loader() {
  const mail = await listMail();

  return { mail };
}

// TODO: Replace this with a real email service, this page should not exist in the final app
export default function DashboardFakeMailPage() {
  const { mail } = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <h1 className="text-xl">Fake Mail</h1>
      {mail?.length ? (
        mail.map((mail) => (
          <div key={mail.id} className="my-2 p-4 border flex gap-4" data-testid={mail.to}>
            <div>
              <p><i>Sent:</i> {mail.createdAt}</p>
              <p><i>To:</i> {mail.to}</p>
              <p><i>From:</i> {mail.from}</p>
            </div>
            <div className="flex-1 border-l pl-4">
              <p><i>Subject:</i> {mail.subject}</p>
              {mail.text
                ? <p>{mail.text}</p>
                : <div dangerouslySetInnerHTML={{ __html: mail.html || '' }} />
              }
            </div>
          </div>
        ))
      ) : (
        <p>No mail found.</p>
      )}
    </div>
  );
}