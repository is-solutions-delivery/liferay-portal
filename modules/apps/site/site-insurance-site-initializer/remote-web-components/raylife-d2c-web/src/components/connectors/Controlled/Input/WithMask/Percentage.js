import React from "react";

import { ControlledInputWithMask } from ".";

export const PercentageControlledInput = ({
  inputProps = {},
  ...props
}) => {
  return (
    <ControlledInputWithMask
      {...props}
      inputProps={{
        suffix: "%",
        mask: "_",
        decimalScale: 2,
        placeholder: "%",
        ...inputProps,
      }}
    />
  );
};
