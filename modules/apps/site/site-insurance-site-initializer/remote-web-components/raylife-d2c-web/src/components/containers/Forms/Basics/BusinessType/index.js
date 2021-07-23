import React from "react";
import { useFormContext } from "react-hook-form";

import { BusinessTypeRadioGroup } from "./RadioGroup";
import { useStepWizard } from "../../../../../hooks/useStepWizard";
import { useBusinessTypes } from "../../../../../hooks/useBusinessTypes";
import { AVAILABLE_STEPS } from "../../../../../utils/constants";
import { BusinessTypeSearch } from "./Search";

export const FormBasicBusinessType = () => {
  const { setSection } = useStepWizard();
  const { businessTypes, reload } = useBusinessTypes();
  const {
    formState: { isValid },
  } = useFormContext();

  const goToNextForm = () => {
    setSection(AVAILABLE_STEPS.BASICS_BUSINESS_INFORMATION);
  };

  return (
    <div className="card">
      <div className="card-content">
        <div className="content-column">
          <BusinessTypeSearch searchBusinessType={reload} />
          <p className="paragraph">
            i.e. Coffee shop, Plumber, Drop Shipping, Landscape, etc
          </p>
        </div>
        <BusinessTypeRadioGroup businessTypes={businessTypes} />
      </div>
      <div className="card-actions">
        <button type="button" className="btn btn-flat">
          Previous
        </button>
        <button
          className="btn btn-secondary"
          onClick={goToNextForm}
          type="submit"
          disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
