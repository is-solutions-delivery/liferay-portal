import React from "react";

import { ControlledInputWithMask } from ".";
import { ZIP_REGEX } from "../../../../../utils/patterns";

export const ZIPControlledInput = ({
  rules = {},
  inputProps = {},
  ...props
}) => {
  return (
    <ControlledInputWithMask
      {...props}
      rules={{
        pattern: {
          value: ZIP_REGEX,
          message: "Must be a five digit number.",
        },
        ...rules,
      }}
      inputProps={{ format: "#####", mask: "_", ...inputProps }}
    />
  );
};
