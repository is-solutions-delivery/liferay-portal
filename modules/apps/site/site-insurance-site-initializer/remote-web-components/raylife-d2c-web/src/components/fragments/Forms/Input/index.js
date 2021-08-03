import React from "react";

import { Label } from "../Label";
import { InputAreaWithError } from "../InputArea/WithError";

export const Input = React.forwardRef(
  ({ name, label, renderActions, error, required = false, ...props }, ref) => {
    return (
      <InputAreaWithError error={error}>
        {label && (
          <Label name={name} label={label} required={required}>
            {renderActions}
          </Label>
        )}
        <input {...props} ref={ref} name={name} required={required} />
      </InputAreaWithError>
    );
  }
);
