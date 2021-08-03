import React from "react";

export const Label = ({ name, label, children, required = false }) => {
  return (
    <label htmlFor={name}>
      <span className={`${required && "required"}`}>{label}</span>
      {children}
    </label>
  );
};
