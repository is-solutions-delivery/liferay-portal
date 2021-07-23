import React from "react";

export const Input = React.forwardRef(
  ({ name, label, renderActions, ...props }, ref) => {
    return (
      <div className="input-area">
        {label && (
          <label htmlFor={name}>
            {label}
            {renderActions}
          </label>
        )}
        <input {...props} ref={ref} name={name} />
      </div>
    );
  }
);
