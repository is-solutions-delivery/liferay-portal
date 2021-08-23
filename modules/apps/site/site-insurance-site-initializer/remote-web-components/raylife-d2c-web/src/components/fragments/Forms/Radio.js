import React from "react";

export const Radio = React.forwardRef(
  (
    {
      name,
      label,
      sideLabel,
      renderActions,
      description,
      value,
      selected = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`radio-card ${selected && "selected"}`}
        onClick={() =>
          props.onChange({
            target: {
              value,
            },
          })
        }
      >
        <input
          {...props}
          name={name}
          checked={selected}
          value={value}
          type="radio"
          className="radio"
          onChange={() =>
            props.onChange({
              target: {
                value,
              },
            })
          }
        />
        <div className="content">
          <div className="content-header">
            <label htmlFor={name}>
              {label}
              <small>{sideLabel}</small>
            </label>
            {renderActions}
          </div>
          <p>{description}</p>
        </div>
      </div>
    );
  }
);
