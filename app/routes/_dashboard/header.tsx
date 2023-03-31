import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export const Header = () => {
  const user = useOptionalUser();

  return (
    <header>
      <nav
        className="relative flex w-full items-center justify-between bg-blue-900 bg-blue-900 py-2 text-blue-100 shadow-lg hover:text-blue-200 focus:text-blue-700 md:flex-wrap md:justify-start"
        data-te-navbar-ref
      >
        <div className="flex w-full flex-wrap items-center justify-between px-6">
          <div className="flex items-center">
            <button
              className="mr-2 border-0 bg-transparent py-2 text-xl leading-none transition-shadow duration-150 ease-in-out hover:text-white focus:text-neutral-700 focus:text-white lg:hidden"
              type="button"
              data-te-collapse-init
              data-te-target="#navbarSupportedContentY"
              aria-controls="navbarSupportedContentY"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="[&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </span>
            </button>
          </div>
          <div
            className="!visible flex hidden grow basis-[100%] items-center justify-between lg:!flex lg:basis-auto"
            id="navbarSupportedContentY"
            data-te-collapse-item
          >
            <div className="flex flex-row items-center gap-4">
              <div className="h-[40px] w-[40px] rounded border border-white">
                <img
                  className="h-full w-full object-contain opacity-90"
                  src="/images/bearclaw.png"
                  alt=""
                />
              </div>
              <div className="block text-lg font-light uppercase tracking-widest text-white drop-shadow-md">
                BEARCLAW
              </div>
            </div>
            <ul
              className="flex flex-col gap-2 lg:flex-row lg:gap-4"
              data-te-navbar-nav-ref
            >
              <li>{user?.email}</li>
              <li data-te-nav-item-ref>
                <Link
                  className="block text-blue-100 transition duration-150 ease-in-out hover:text-white focus:text-white disabled:text-black/30 [&.active]:text-black/90"
                  to="/logout"
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
