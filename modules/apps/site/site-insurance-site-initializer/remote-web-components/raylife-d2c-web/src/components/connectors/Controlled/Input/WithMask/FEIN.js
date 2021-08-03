import React from "react";

import { ControlledInputWithMask } from ".";
import { FEIN_REGEX } from "../../../../../utils/patterns";

export const FEINControlledInput = ({
  rules = {},
  inputProps = {},
  ...props
}) => {
  return (
    <ControlledInputWithMask
      {...props}
      rules={{
        pattern: {
          value: FEIN_REGEX,
          message: "Must be a valid FEIN.",
        },
        ...rules,
      }}
      inputProps={{ format: "##-#######", mask: "_", ...inputProps }}
    />
  );
};
