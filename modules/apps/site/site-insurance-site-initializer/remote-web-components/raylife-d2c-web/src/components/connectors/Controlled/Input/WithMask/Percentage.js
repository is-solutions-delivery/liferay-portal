import React from "react";

import { ControlledInputWithMask } from ".";
import { PERCENTAGE_REGEX } from "../../../../../utils/patterns";

export const PercentageControlledInput = ({
  rules = {},
  inputProps = {},
  ...props
}) => {
  return (
    <ControlledInputWithMask
      {...props}
      rules={{
        pattern: {
          value: PERCENTAGE_REGEX,
          message: "Must be a valid percentage",
        },
        ...rules,
      }}
      inputProps={{
        suffix: "%",
        mask: "_",
        decimalScale: 2,
        ...inputProps,
      }}
    />
  );
};
