import React from "react";

import { ControlledInputWithMask } from ".";

export const CurrencyControlledInput = ({ inputProps = {}, ...props }) => {
  return (
    <ControlledInputWithMask
      {...props}
      inputProps={{
        prefix: "$",
        decimalScale: 2,
        thousandSeparator: true,
        fixedDecimalScale: true,
        ...inputProps,
      }}
    />
  );
};
