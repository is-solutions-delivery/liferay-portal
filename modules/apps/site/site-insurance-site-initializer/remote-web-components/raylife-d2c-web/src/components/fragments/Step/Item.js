import React from "react";
import { ProgressRing } from "../ProgressRing";

export const StepItem = ({ selected = false, percentage = 0, children }) => {
  return (
    <div className={`step-item ${selected && "selected"}`}>
      <i>
        {selected && (
          <ProgressRing
            className="progress-ring"
            diameter={32}
            percent={percentage}
            strokeWidth={3}
          />
        )}
      </i>
      {children}
    </div>
  );
};
