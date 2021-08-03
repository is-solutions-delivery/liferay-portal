import React from "react";

import { ControlledSelect } from ".";
import { useLocation } from "../../../../hooks/useLocation";
import { STATE_REGEX } from "../../../../utils/patterns";

export function StatesControlledSelect({ rules, ...props }) {
  const { states } = useLocation();

  return (
    <ControlledSelect
      {...props}
      rules={{
        pattern: {
          value: STATE_REGEX,
          message: "Should be a two letter word.",
        },
        ...rules,
      }}
      defaultValue="AL"
    >
      {states.map(({ abbreviation }) => (
        <option key={abbreviation} value={abbreviation}>
          {abbreviation}
        </option>
      ))}
    </ControlledSelect>
  );
}
