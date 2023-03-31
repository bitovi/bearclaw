import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

interface AProps extends LinkProps {
  type: "link";
}

type Props = (React.ComponentPropsWithRef<"button"> | AProps) & {
  variant?: "primary";
};

const styles = {
  primary: "text-white bg-blue-700 hover:bg-blue-800 focus:bg-blue-600",
  secondary: "text-blue-800 bg-white hover:bg-blue-50 border",
};

export const Button: React.FC<Props> = ({
  children,
  variant,
  className,
  ...props
}) => {
  const classes = `
    flex 
    items-center 
    justify-center 
    rounded-md 
    px-4 
    py-3 
    font-medium 
    ${styles[variant || "primary"]} 
    ${className || ""}
  `;

  if (props.type === "link") {
    return (
      <Link {...props} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};
