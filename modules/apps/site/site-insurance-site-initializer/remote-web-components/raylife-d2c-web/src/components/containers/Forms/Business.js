import React from "react";
import { useFormContext } from "react-hook-form";

import { AVAILABLE_STEPS } from "../../../utils/constants";
import { useStepWizard } from "../../../hooks/useStepWizard";
import { INPUT_INFO_EVENT } from "../../../events";
import { CardFormActionsWithSave } from "../../fragments/Card/FormActionsWithSave";
import { ControlledSwitch } from "../../connectors/Controlled/Switch";
import { NumberControlledInput } from "../../connectors/Controlled/Input/Number";
import { PercentageControlledInput } from "../../connectors/Controlled/Input/WithMask/Percentage";
import { LegalEntityControlledSelect } from "../../connectors/Controlled/Select/LegalEntity";

const setFormPath = (value) => `business.${value}`;

export const FormBusiness = () => {
  const {
    control,
    formState: { isValid },
  } = useFormContext();
  const { setSection } = useStepWizard();

  const goToPreviousForm = () =>
    setSection(AVAILABLE_STEPS.BASICS_PRODUCT_QUOTE);

  const goToNextForm = () => setSection(AVAILABLE_STEPS.EMPLOYEES);

  return (
    <div className="card">
      <div className="card-content">
        <NumberControlledInput
          name={setFormPath("yearsOfExperience")}
          label="Years of industry experience?"
          rules={{
            required: "This field is required",
            min: {
              value: 0,
              message: "Must be equal or grater than 0.",
            },
          }}
          moreInfoProps={{
            event: INPUT_INFO_EVENT,
            value: "yearsOfExperience",
          }}
          control={control}
        />
        <ControlledSwitch
          name={setFormPath("hasStoredCustomerInformation")}
          label="Do you store personally identifiable information about your customers?"
          rules={{ required: true }}
          control={control}
        />
        <ControlledSwitch
          name={setFormPath("hasAutoPolicy")}
          label="Do you have a Raylife Auto policy?"
          rules={{ required: true }}
          control={control}
        />
        <LegalEntityControlledSelect
          name={setFormPath("legalEntity")}
          label="Legal Entity"
          rules={{
            required: "This field is required.",
          }}
          control={control}
        />
        <PercentageControlledInput
          name={setFormPath("salesMerchandise")}
          label="Percent of sales from used merchandise?"
          rules={{
            required: "Percent of sales is required.",
          }}
          moreInfoProps={{
            event: INPUT_INFO_EVENT,
            value: "salesMerchandise",
          }}
          control={control}
        />
        <ControlledSwitch
          name={setFormPath("hasSellProductsUnderOwnBrand")}
          label="Do you sell products under your own brand or label?"
          rules={{ required: true }}
          control={control}
        />
        <PercentageControlledInput
          name={setFormPath("overallSales")}
          label="What percentage of overall sales involve delivery?"
          rules={{
            required: "Percent of overall sales is required.",
          }}
          moreInfoProps={{
            event: INPUT_INFO_EVENT,
            value: "overallSales",
          }}
          control={control}
        />
      </div>
      <CardFormActionsWithSave
        onPrevious={goToPreviousForm}
        onNext={goToNextForm}
        isValid={isValid}
      />
    </div>
  );
};
