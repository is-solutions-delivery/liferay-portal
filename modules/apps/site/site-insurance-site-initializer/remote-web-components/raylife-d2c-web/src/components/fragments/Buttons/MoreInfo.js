import React from "react";
import { useCustomEvent } from "../../../hooks/useCustomEvent";

export const MoreInfoButton = ({ value, event }) => {
  // eslint-disable-next-line no-unused-vars
  const [dispatchEvent] = useCustomEvent(event);

  return (
    <button
      type="button"
      className="btn badge"
      onClick={() => dispatchEvent(value)}
    >
      More Info
    </button>
  );
};
