import React from "react";

export const Switch = React.forwardRef(
  (
    {
      name,
      label,
      renderActions,
      value = "true",
      onChange = () => {},
      ...props
    },
    ref
  ) => {
    return (
      <div className="input-area">
        {label && (
          <label htmlFor={name}>
            {label}
            {renderActions}
          </label>
        )}
        <div className="switch-wrapper">
          <button
            className={`btn switch ${value === "true" && "selected"}`}
            type="button"
            onClick={() => onChange("true")}
          >
            Yes
          </button>
          <button
            className={`btn switch ${value === "false" && "selected"}`}
            type="button"
            onClick={() => onChange("false")}
          >
            No
          </button>
        </div>
        <input
          {...props}
          ref={ref}
          name={name}
          value={value}
          onChange={onChange}
          className="hidden"
        />
      </div>
    );
  }
);
