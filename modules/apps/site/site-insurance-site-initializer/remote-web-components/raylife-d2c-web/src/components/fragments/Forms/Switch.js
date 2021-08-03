import React from "react";

import { Label } from "./Label";
import { InputAreaWithError } from "./InputArea/WithError";

export const Switch = React.forwardRef(
  (
    {
      name,
      label,
      renderActions,
      error,
      value = "true",
      required = false,
      onChange = () => {},
      ...props
    },
    ref
  ) => {
    return (
      <InputAreaWithError error={error}>
        {label && (
          <Label name={name} label={label} required={required}>
            {renderActions}
          </Label>
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
      </InputAreaWithError>
    );
  }
);
