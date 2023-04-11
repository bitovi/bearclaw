import { Link } from "@remix-run/react";

export function Sidenav() {
  return (
    <div className="flex flex-col gap-4">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/analysis">Analysis</Link>
        </li>
        <li>
          <Link to="/supplyChain">Supply Chain</Link>
        </li>
      </ul>
    </div>
  );
}
