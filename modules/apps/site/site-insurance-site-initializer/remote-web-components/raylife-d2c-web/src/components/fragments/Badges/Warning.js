import React from "react";

export const WarningBadge = ({ children, ...props }) => {
  return (
    <div {...props} className="badge badge-error">
      {children}
    </div>
  );
};
