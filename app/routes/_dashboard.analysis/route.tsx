import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { getAllParentJobs } from "~/services/getAllParentJobs";

export async function loader() {
  const files = await getAllParentJobs();
  return json({
    files,
  });
}

export default function Route() {
  const { files } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Analyzed Files</h1>
      <div>
        <table className="min-w-full text-left text-sm font-light">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-4">
                Filename
              </th>
              <th scope="col" className="px-6 py-4">
                Type
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>
              <th scope="col" className="px-6 py-4">
                Size
              </th>
              <th scope="col" className="px-6 py-4">
                Analysis Date
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file._id}
                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <Link to={`/analysis/${file._id}`}>{file.filename}</Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{file.type}</td>
                <td className="whitespace-nowrap px-6 py-4">{file.status}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {file.size.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {new Date(file.analyzedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
