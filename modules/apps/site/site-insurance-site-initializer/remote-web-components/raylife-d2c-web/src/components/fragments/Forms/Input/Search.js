import React from "react";

import { Label } from "../Label";
import { InputAreaWithError } from "../InputArea/WithError";

export const SearchInput = React.forwardRef(
  (
    { name, label, renderActions, children, required = false, error, ...props },
    ref
  ) => {
    return (
      <InputAreaWithError error={error}>
        {label && (
          <Label name={name} label={label} required={required}>
            {renderActions}
          </Label>
        )}
        <div className="content-row">
          <input
            {...props}
            ref={ref}
            name={name}
            required={required}
            maxLength={256}
          />
          {children}
        </div>
      </InputAreaWithError>
    );
  }
);
