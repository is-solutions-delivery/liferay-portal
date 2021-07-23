import React, { useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "../../../../../hooks/useLocation";
import { Input } from "../../../../fragments/Forms/Input";
import { SelectInput } from "../../../../fragments/Forms/Input/Select";

const setFormPath = (value) =>
  `basics.businessInformation.business.location.${value}`;

export const BusinessInformationAddress = () => {
  const ref = useRef();
  const { states, setAutoComplete } = useLocation();
  const { register, control, setValue } = useFormContext();

  useEffect(() => {
    if (ref.current) setAutoComplete(ref.current, updateFormWithGoogleAddress);
  }, [ref]);

  const updateFormWithGoogleAddress = (address) => {
    setValue(setFormPath("city"), address.city);
    setValue(setFormPath("state"), address.state);
    setValue(setFormPath("zip"), address.zip);
    setValue(
      setFormPath("address"),
      `${address.streetNumber}, ${address.street}`
    );
  };

  return (
    <>
      <div
        className="content-row"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 35%",
        }}
      >
        <Controller
          name={setFormPath("address")}
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              label="Physical Business Address"
              placeholder="Street address"
              ref={ref}
            />
          )}
        />
        <Input
          {...register(setFormPath("addressApt"))}
          placeholder="Apt/Suite (optional)"
        />
      </div>
      <div
        className="content-row"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 15% 25%",
        }}
      >
        <Input
          {...register(setFormPath("city"), {
            required: true,
          })}
          label="City"
        />
        <SelectInput
          {...register(setFormPath("state"), {
            maxLength: 2,
            pattern: /[A-Za-z]/g,
            required: true,
            value: "AL",
          })}
          label="State"
          maxLength={2}
        >
          {states.map(({ abbreviation }, index) => (
            <option key={`${abbreviation}-${index}`} value={abbreviation}>
              {abbreviation}
            </option>
          ))}
        </SelectInput>
        <Input
          {...register(setFormPath("zip"), {
            minLength: 5,
            required: true,
            pattern: /[0-9]/g,
          })}
          label="ZIP"
          maxLength={5}
        />
      </div>
    </>
  );
};
