type DropdownProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: React.OptionHTMLAttributes<HTMLOptionElement>[];
  containerClasses?: string;
  labelClasses?: string;
  selectClasses?: string;
  optionClasses?: string;
  verticalLabel?: boolean;
};

export const Dropdown = ({
  name,
  label,
  options = [],
  containerClasses: _containerClasses,
  labelClasses: _labelClasses,
  selectClasses: _selectClasses,
  optionClasses: _optionClasses,
  verticalLabel = false,
  ...props
}: DropdownProps) => {
  const containerClasses = `
    ${verticalLabel ? "flex-row" : ""}
    ${_containerClasses || ""}
  `;
  const labelClasses = `
    ${verticalLabel ? "flex" : "px-2"}
    ${_labelClasses || ""}
  `;
  const selectClasses = `
    border
    ${verticalLabel ? "justify-self-center w-full" : ""}
    ${_selectClasses || ""}
  `;
  const optionClasses = `
    text-center
    ${_optionClasses || ""}
  `;

  return (
    <div className={containerClasses}>
      <label htmlFor={`${name}-select`} className={labelClasses}>
        {label || name}
      </label>
      <select
        name={name}
        id={`${name}-select`}
        {...props}
        className={selectClasses}
      >
        {options.map(({ label, ...props }, i) => {
          return (
            <option
              key={`${props.value}-${i}`}
              className={optionClasses}
              {...props}
            >
              {label || props.value}
            </option>
          );
        })}
      </select>
    </div>
  );
};
