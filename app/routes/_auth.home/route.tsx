import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();

  return (
    <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
      {user ? (
        <Link
          to="/logout"
          className="flex items-center justify-center rounded-md bg-blue-700 px-4 py-3 font-medium text-white hover:bg-blue-800 focus:bg-blue-600"
        >
          Logout
        </Link>
      ) : (
        <>
          <Link
            to="/join"
            className="flex items-center justify-center rounded-md border border border-blue-700 bg-white px-4 py-3 text-base font-medium text-blue-800 shadow-sm hover:bg-blue-50 sm:px-8"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center rounded-md bg-blue-700 px-4 py-3 font-medium text-white hover:bg-blue-800 focus:bg-blue-600"
          >
            Log In
          </Link>
        </>
      )}
    </div>
  );
}
