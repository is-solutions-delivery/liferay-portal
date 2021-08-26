import React from "react";

import { ControlledInputWithMask } from ".";
import { YEAR_REGEX } from "../../../../../utils/patterns";

export const YearControlledInput = ({
  rules = {},
  inputProps = {},
  ...props
}) => {
  return (
    <ControlledInputWithMask
      {...props}
      rules={{
        pattern: {
          value: YEAR_REGEX,
          message: "Must be a valid year.",
        },
        max: {
          value: new Date().getFullYear(),
          message: "You cannot enter a future year.",
        },
        ...rules,
      }}
      inputProps={{ format: "####", mask: "_", ...inputProps }}
    />
  );
};
