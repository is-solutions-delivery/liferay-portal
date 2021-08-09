import React from "react";
import ReactInputMask from "react-number-format";
import { InputAreaWithError } from "../InputArea/WithError";
import { Label } from "../Label";

export const InputWithMask = React.forwardRef(
  (
    {
      name,
      label,
      renderActions,
      error,
      allowNegative = false,
      required = false,
      placeholder = "",
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
        <ReactInputMask
          {...props}
          allowNegative={allowNegative}
          ref={ref}
          name={name}
          className="input"
          required={required}
          placeholder={placeholder}
        />
      </InputAreaWithError>
    );
  }
);
