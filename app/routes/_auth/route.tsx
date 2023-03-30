import type { V2_MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: V2_MetaFunction = () => [
  {
    title: "Authentication",
  },
];

export default function Index() {
  return (
    <main className="bg-[color:rgba(0, 0, 0, .05)] relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative">
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32 ">
              <div className="flex flex-col gap-6">
                <div className="flex flex-row items-center gap-6">
                  <div className="h-[80px] w-[80px] rounded bg-blue-900 p-2">
                    <img
                      className="h-full w-full object-contain opacity-90"
                      src="/images/bearclaw.png"
                      alt=""
                    />
                  </div>
                  <h1 className="text-center text-6xl font-light tracking-tight tracking-widest sm:text-5xl lg:text-6xl">
                    <span className="block uppercase text-blue-800 drop-shadow-sm">
                      BEARCLAW
                    </span>
                  </h1>
                </div>
                <div>
                  <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
