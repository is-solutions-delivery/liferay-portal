import React from "react";

import { ControlledInputWithMask } from ".";
import { PHONE_REGEX } from "../../../../../utils/patterns";

export const PhoneControlledInput = ({
  rules = {},
  inputProps = {},
  ...props
}) => {
  return (
    <ControlledInputWithMask
      {...props}
      rules={{
        pattern: {
          value: PHONE_REGEX,
          message: "Must be a valid phone number.",
        },
        ...rules,
      }}
      inputProps={{ format: "(###) ###-####", mask: "_", ...inputProps }}
    />
  );
};
