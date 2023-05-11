import { Await, useLoaderData } from "@remix-run/react";
import { defer } from "@remix-run/server-runtime";
import { Suspense } from "react";
import { getRsbomDetails } from "~/services/rsboms/getRsbomDetails";
import { getRsboms } from "~/services/rsboms/getRsboms";

const getAllRsbomDetails = async (rsbomIds: string[]) => {
  const collection: Record<
    string,
    Awaited<ReturnType<typeof getRsbomDetails>>
  > = {};
  for (const id of rsbomIds) {
    const details = await getRsbomDetails(id);
    collection[id] = details;
  }
  return collection;
};

export async function loader() {
  const rsboms = await getRsboms();
  const rsbomDetails = getAllRsbomDetails(
    rsboms.map((rsbom) => rsbom.dataObject)
  );

  return defer({
    rsboms,
    rsbomDetails,
  });
}

export default function Route() {
  const { rsboms, rsbomDetails } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>rSBOM - Reverse Software Bill of Materials</h1>
      <div>
        {rsboms.map((rsbom) => (
          <details
            key={rsbom.id}
            className="cursor-pointer border-b transition duration-300 ease-in-out hover:bg-neutral-100"
          >
            <summary className="flex flex-row justify-between whitespace-nowrap px-4 py-2">
              <div className="bold">{rsbom.filename}</div>
              <div className="">
                {new Date(rsbom.timestamp).toLocaleDateString()}
              </div>
            </summary>
            <Suspense fallback={<div className="w-full p-8">Loading...</div>}>
              <Await
                resolve={rsbomDetails}
                errorElement={
                  <div>
                    There was an error loading the details of this package
                  </div>
                }
              >
                {(rsbomDetails) => {
                  if (!rsbomDetails[rsbom.dataObject]) return null;

                  const { vulnerabilities } = rsbomDetails[rsbom.dataObject];
                  return (
                    <div className=" flex flex-col gap-4 px-6 py-2">
                      <h3>Details:</h3>

                      {vulnerabilities.map((vulnerability) => (
                        <ul key={vulnerability.id}>
                          <li>Source: {vulnerability.source}</li>
                          <li>{vulnerability.details}</li>
                          {vulnerability.exploitability ? (
                            <li>
                              Exploitability:
                              <ul>
                                <li>
                                  Attack Complexity:{" "}
                                  {
                                    vulnerability.exploitability
                                      ?.attackComplexity
                                  }
                                </li>
                                <li>
                                  Attack Vector:{" "}
                                  {vulnerability.exploitability?.attackVector}
                                </li>
                                <li>
                                  Privileges Required:{" "}
                                  {
                                    vulnerability.exploitability
                                      ?.privilegesRequired
                                  }
                                </li>
                                <li>
                                  Scope: {vulnerability.exploitability?.scope}
                                </li>
                                <li>
                                  User Interaction:{" "}
                                  {
                                    vulnerability.exploitability
                                      ?.userInteraction
                                  }
                                </li>
                              </ul>
                            </li>
                          ) : null}
                        </ul>
                      ))}
                    </div>
                  );
                }}
              </Await>
            </Suspense>
          </details>
        ))}
      </div>
    </div>
  );
}
