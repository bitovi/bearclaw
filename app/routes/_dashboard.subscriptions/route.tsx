import { Await, useLoaderData } from "@remix-run/react";
import { defer } from "@remix-run/node";
import { subscriptionOptionLookup } from "~/payment.server";
import type { ExpandedPrice } from "~/payment.server";
import { Suspense } from "react";
import { Link } from "~/components/link";

export async function loader() {
  const result = subscriptionOptionLookup();
  return defer({ data: result });
}

const Option = ({ opt }: { opt: ExpandedPrice }) => {
  return (
    <div className="flex w-fit">
      <Link to={`/form/${opt.id}`} key={opt.id}>
        {opt.product.name}
      </Link>
    </div>
  );
};

export default function Route() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div>
      <Suspense fallback={<div>LOADING ... </div>}>
        <Await resolve={data}>
          {({ subscriptionOptions, error }) => {
            if (error) return <div>{error}</div>;
            return (
              <div className="flex w-full justify-evenly">
                {subscriptionOptions?.map((opt) => {
                  return <Option key={opt.id} opt={opt} />;
                })}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
