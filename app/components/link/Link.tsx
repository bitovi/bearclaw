import type { LinkProps } from "@remix-run/react";
import { AnchorHTMLAttributes } from "react";

import { Link as _Link } from "@remix-run/react";

/**
 * returns either a Link component or anchor element,
 * dependent upon whether user passes a "to" or "href" prop, respectively.
 */
export const Link: React.FC<
  AnchorHTMLAttributes<HTMLAnchorElement> | LinkProps
> = ({ children, className, ...props }) => {
  const classes = `
    underline
    text-blue-800
    ${className || ""}
  `;

  if ("to" in props) {
    return (
      <_Link {...props} className={classes} data-testid={"internal-link"}>
        {children}
      </_Link>
    );
  }

  return (
    <a {...props} data-testid={"external-link"} className={classes}>
      {children}
    </a>
  );
};
