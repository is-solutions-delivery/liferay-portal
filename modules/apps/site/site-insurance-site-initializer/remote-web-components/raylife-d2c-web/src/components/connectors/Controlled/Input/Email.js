import React from "react";

import { ControlledInput } from ".";
import { EMAIL_REGEX } from "../../../../utils/patterns";

export const EmailControlledInput = ({ rules, ...props }) => {
  return (
    <ControlledInput
      {...props}
      rules={{
        pattern: {
          value: EMAIL_REGEX,
          message: "Should be a valid email address.",
        },
        ...rules,
      }}
    />
  );
};
