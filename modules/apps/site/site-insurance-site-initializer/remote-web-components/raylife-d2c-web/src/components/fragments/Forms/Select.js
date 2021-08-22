import ClayIcon from "@clayui/icon";
import React from "react";
import { InputAreaWithError } from "./InputArea/WithError";
import { Label } from "./Label";

export const Select = React.forwardRef(
  (
    { name, label, children, renderActions, error, required = false, ...props },
    ref
  ) => {
    return (
      <InputAreaWithError error={error}>
        {label && (
          <Label name={name} label={label} required={required}>
            {renderActions}
          </Label>
        )}
        <ClayIcon className="select-icon" symbol="caret-bottom" />
        <select
          {...props}
          ref={ref}
          name={name}
          className="input"
          required={required}
        >
          {children}
        </select>
      </InputAreaWithError>
    );
  }
);
