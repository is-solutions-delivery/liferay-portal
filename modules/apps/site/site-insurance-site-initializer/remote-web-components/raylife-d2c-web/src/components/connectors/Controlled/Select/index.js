import React from "react";
import { Controller } from "react-hook-form";

import { MoreInfoButton } from "../../../fragments/Buttons/MoreInfo";
import { Select } from "../../../fragments/Forms/Select";

export const ControlledSelect = ({
  name,
  label,
  control,
  rules,
  children,
  moreInfoProps = undefined,
  inputProps = {},
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue=""
      render={({ field, fieldState }) => (
        <Select
          {...field}
          label={label}
          error={fieldState.error}
          renderActions={moreInfoProps && <MoreInfoButton {...moreInfoProps} />}
          required={rules?.required}
          {...inputProps}
        >
          {children}
        </Select>
      )}
      {...props}
    />
  );
};
