import React from "react";

export const SelectInput = React.forwardRef(
  ({ name, label, children, renderActions, ...props }, ref) => {
    return (
      <div className="input-area">
        {label && (
          <label htmlFor={name}>
            {label}
            {renderActions}
          </label>
        )}
        <select {...props} ref={ref} name={name} className="input">
          {children}
        </select>
      </div>
    );
  }
);
