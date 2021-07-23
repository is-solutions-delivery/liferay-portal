import React from "react";
import ReactInputMask from "react-number-format";

export const InputWithMask = React.forwardRef(
  ({ name, label, renderActions, allowNegative = false, ...props }, ref) => {
    return (
      <div className="input-area">
        {label && (
          <label htmlFor={name}>
            {label}
            {renderActions}
          </label>
        )}
        <ReactInputMask
          {...props}
          allowNegative={allowNegative}
          ref={ref}
          name={name}
          className="input"
        />
      </div>
    );
  }
);
