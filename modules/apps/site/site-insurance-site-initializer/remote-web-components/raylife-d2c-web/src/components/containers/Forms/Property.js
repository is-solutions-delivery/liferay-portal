import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { AVAILABLE_STEPS } from "../../../utils/constants";
import { useStepWizard } from "../../../hooks/useStepWizard";
import { INPUT_INFO_EVENT } from "../../../events";
import { CardFormActionsWithSave } from "../../fragments/Card/FormActionsWithSave";
import { ControlledSwitch } from "../../connectors/Controlled/Switch";
import { NumberControlledInput } from "../../connectors/Controlled/Input/Number";
import { YearControlledInput } from "../../connectors/Controlled/Input/WithMask/Year";
import { SquareFeatControlledInput } from "../../connectors/Controlled/Input/WithMask/SquareFeet";

const setFormPath = (value) => `property.${value}`;

export const FormProperty = () => {
  const form = useWatch();
  const { setSection } = useStepWizard();
  const {
    control,
    formState: { isValid },
  } = useFormContext();

  const goToPreviousForm = () => setSection(AVAILABLE_STEPS.EMPLOYEES);

  return (
    <div className="card">
      <div className="card-content">
        <ControlledSwitch
          name={setFormPath("doOwnBuildingAtAddress")}
          control={control}
          label={`Do you own the building at ${form.basics.businessInformation.business.location.address}?`}
          rules={{ required: true }}
        />
        <NumberControlledInput
          name={setFormPath("stories")}
          control={control}
          label="How many stories is this building?"
          rules={{
            required: "This field is required",
            min: {
              value: 0,
              message: "Must be equal or grater than 0.",
            },
          }}
        />
        <SquareFeatControlledInput
          name={setFormPath("buildingSquareFeetOccupied")}
          label="How many square feet of the building does your business occupy?"
          control={control}
          rules={{
            required: "This field is required",
          }}
          moreInfoProps={{
            event: INPUT_INFO_EVENT,
            value: "buildingSquareFeetOccupied",
          }}
        />
        <SquareFeatControlledInput
          name={setFormPath("totalBuildingSquareFeet")}
          label="How many total square feet is the building?"
          control={control}
          rules={{
            required: "This field is required",
          }}
        />
        <YearControlledInput
          name={setFormPath("yearBuilding")}
          label="What year was the building constructed?"
          control={control}
          rules={{
            required: "This field is required",
          }}
        />
        <ControlledSwitch
          name={setFormPath("isPrimaryBusinessLocation")}
          label="Is this the primary location you conduct business?"
          control={control}
          rules={{ required: true }}
          moreInfoProps={{
            event: INPUT_INFO_EVENT,
            value: "isPrimaryBusinessLocation",
          }}
        />
      </div>
      <CardFormActionsWithSave
        onPrevious={goToPreviousForm}
        isValid={isValid}
      />
    </div>
  );
};
