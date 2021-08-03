import React from "react";
import { Controller } from "react-hook-form";

import { MoreInfoButton } from "../../../../fragments/Buttons/MoreInfo";
import { InputWithMask } from "../../../../fragments/Forms/Input/WithMask";

export const ControlledInputWithMask = ({
  name,
  label,
  rules,
  control,
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
        <InputWithMask
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
