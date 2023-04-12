const styles = {
  primary: "text-white bg-blue-700 hover:bg-blue-800 focus:bg-blue-600",
  secondary: "text-blue-800 bg-white hover:bg-blue-50 border",
};

type Props = React.ComponentPropsWithRef<"button"> & {
  variant?: keyof typeof styles;
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

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};
