import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Input } from "../../fragments/Forms/Input";
import { Switch } from "../../fragments/Forms/Switch";
import { AVAILABLE_STEPS } from "../../../utils/constants";
import { useStepWizard } from "../../../hooks/useStepWizard";
import { InputWithMask } from "../../fragments/Forms/Input/WithMask";
import { useLiferayState } from "../../../hooks/useLiferayState";

const MORE_INFO_ATOM = "more-info-input-label";

const setFormPath = (value) => `business.${value}`;

export const FormBusiness = () => {
  const {
    register,
    control,
    formState: { isValid },
  } = useFormContext();
  const { setSection } = useStepWizard();
  const { writeAtom } = useLiferayState();

  const goToPreviousForm = () =>
    setSection(AVAILABLE_STEPS.BASICS_PRODUCT_QUOTE);

  const goToNextForm = () => setSection(AVAILABLE_STEPS.EMPLOYEES);

  const handleMoreInfo = (label) => {
    writeAtom(MORE_INFO_ATOM, label);
  };

  return (
    <div className="card">
      <div className="card-content">
        <Input
          name="yearsOfExperience"
          label="Years of industry experience?"
          renderActions={
            <button
              type="button"
              onClick={() => handleMoreInfo("yearsOfExperience")}
              className="btn badge"
            >
              More Info
            </button>
          }
          type="number"
          min={0}
          {...register(setFormPath("yearsOfExperience"), {
            required: true,
          })}
        />
        <Controller
          name={setFormPath("hasStoredCustomerInformation")}
          defaultValue="false"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Switch
              {...field}
              label="Do you store personally identifiable information about your customers?"
            />
          )}
        />
        <Controller
          name={setFormPath("hasAutoPolicy")}
          defaultValue="false"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Switch {...field} label="Do you have a Raylife Auto policy?" />
          )}
        />
        <Controller
          name={setFormPath("salesMerchandise")}
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => (
            <InputWithMask
              {...field}
              renderActions={
                <button
                  type="button"
                  onClick={() => handleMoreInfo("salesMerchandise")}
                  className="btn badge"
                >
                  More Info
                </button>
              }
              label="Percent of sales from used merchandise?"
              suffix="%"
              mask="_"
              decimalScale={2}
            />
          )}
        />

        <Controller
          name={setFormPath("hasSellProductsUnderOwnBrand")}
          defaultValue="false"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Switch
              {...field}
              label="Do you sell products under your own brand or label?"
            />
          )}
        />
      </div>
      <div className="card-actions">
        <button
          type="button"
          className="btn btn-flat"
          onClick={goToPreviousForm}
        >
          Previous
        </button>
        <div>
          <button type="button" className="btn btn-outline">
            Save & Exit
          </button>
          <button
            className="btn btn-secondary"
            type="submit"
            onClick={goToNextForm}
            disabled={!isValid}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
