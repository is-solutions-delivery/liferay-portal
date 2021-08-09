import React from "react";
import { Controller } from "react-hook-form";

import { MoreInfoButton } from "../../fragments/Buttons/MoreInfo";
import { Switch } from "../../fragments/Forms/Switch";

export const ControlledSwitch = ({
  name,
  label,
  control,
  rules,
  moreInfoProps = undefined,
  inputProps = {},
  defaultValue = "false",
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Switch
          {...field}
          label={label}
          error={fieldState.error}
          renderActions={moreInfoProps && <MoreInfoButton {...moreInfoProps} />}
          required={rules?.required}
          {...inputProps}
        />
      )}
      {...props}
    />
  );
};
