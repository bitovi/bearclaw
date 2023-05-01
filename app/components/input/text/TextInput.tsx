type InputProps = React.ComponentPropsWithRef<"input"> & {
  inputClasses?: string;
  containerClasses?: string;
  label?: string;
  labelClasses?: string;
  verticalLabel?: boolean;
};

export const TextInput: React.FC<InputProps> = ({
  children,
  inputClasses: _inputClasses,
  containerClasses: _containerClasses,
  label,
  labelClasses: _labelClasses,
  name,
  verticalLabel = false,
  ...props
}) => {
  const inputClasses = `
    border
    ${_inputClasses || ""}
    `;

  const containerClasses = `
    ${verticalLabel ? "flex-row" : ""}
    ${_containerClasses || ""}
    `;

  const labelClasses = `
    ${verticalLabel ? "flex" : "px-2"}
    ${_labelClasses || ""}
    `;

  return (
    <div className={containerClasses}>
      <label className={labelClasses} htmlFor={name}>
        {label || name}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        className={inputClasses}
        {...props}
      />
    </div>
  );
};
