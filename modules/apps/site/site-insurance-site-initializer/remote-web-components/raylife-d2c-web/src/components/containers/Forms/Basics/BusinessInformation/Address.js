/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "../../../../fragments/Forms/Input";
import { useLocation } from "../../../../../hooks/useLocation";
import { ControlledInput } from "../../../../connectors/Controlled/Input";
import { ZIPControlledInput } from "../../../../connectors/Controlled/Input/WithMask/ZIP";
import { StatesControlledSelect } from "../../../../connectors/Controlled/Select/States";

const setFormPath = (value) =>
  `basics.businessInformation.business.location.${value}`;

export const BusinessInformationAddress = () => {
  const ref = useRef();
  const { setAutoComplete } = useLocation();
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
          gridTemplateColumns: "1fr 29.7%",
        }}
      >
        <ControlledInput
          name={setFormPath("address")}
          label="Physical Business Address"
          rules={{ required: "Business address is required." }}
          control={control}
          inputProps={{
            ref,
            placeholder: "Street address",
          }}
        />
        <Input
          {...register(setFormPath("addressApt"))}
          label="&nbsp;"
          placeholder="Apt/Suite (optional)"
        />
        <div
          className="content-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 25.2%",
          }}
        >
          <ControlledInput
            name={setFormPath("city")}
            label="City"
            rules={{ required: "City is required." }}
            control={control}
          />

          <StatesControlledSelect
            name={setFormPath("state")}
            label="State"
            control={control}
            rules={{
              required: "This field is required.",
            }}
          />
        </div>
        <div
          className="content-row"
        >
          <ZIPControlledInput
            name={setFormPath("zip")}
            label="ZIP"
            control={control}
            rules={{
              required: "ZIP is required.",
            }}
          />
        </div>
      </div>
    </>
  );
};
