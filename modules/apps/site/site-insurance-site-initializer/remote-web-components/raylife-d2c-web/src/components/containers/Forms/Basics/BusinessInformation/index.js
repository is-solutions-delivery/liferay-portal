import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { BusinessInformationAddress } from "./Address";
import { AVAILABLE_STEPS } from "../../../../../utils/constants";
import { LiferayService } from "../../../../../services/liferay";
import { useStepWizard } from "../../../../../hooks/useStepWizard";
import { CardFormActionsWithSave } from "../../../../fragments/Card/FormActionsWithSave";
import { EmailControlledInput } from "../../../../connectors/Controlled/Input/Email";
import { WebsiteControlledInput } from "../../../../connectors/Controlled/Input/Website";
import { PhoneControlledInput } from "../../../../connectors/Controlled/Input/WithMask/Phone";
import { ControlledInput } from "../../../../connectors/Controlled/Input";

const setFormPath = (value) => `basics.businessInformation.${value}`;

export const FormBasicBusinessInformation = () => {
  const form = useWatch();
  const { setSection } = useStepWizard();
  const {
    control,
    formState: { isValid },
  } = useFormContext();

  const onSave = async () => {
    try {
      await LiferayService.createBasicsApplication(form.basics);
    } catch (error) {
      console.error(error);
    }
  };

  const goToPreviousForm = () =>
    setSection(AVAILABLE_STEPS.BASICS_BUSINESS_TYPE);

  const goToNextForm = () => {
    onSave();
    setSection(AVAILABLE_STEPS.BASICS_PRODUCT_QUOTE);
  };

  return (
    <div className="card">
      <div className="card-content">
        <div className="content-row">
          <ControlledInput
            name={setFormPath("firstName")}
            label="First Name"
            control={control}
            rules={{
              required: "First name is required.",
            }}
          />
          <ControlledInput
            name={setFormPath("lastName")}
            label="Last name"
            control={control}
            rules={{
              required: "Last name is required.",
            }}
          />
        </div>
        <EmailControlledInput
          name={setFormPath("business.email")}
          label="Business Email"
          control={control}
          rules={{
            required: "Email is required.",
          }}
        />
        <PhoneControlledInput
          name={setFormPath("business.phone")}
          label="Phone"
          control={control}
          rules={{
            required: "Phone number is required.",
          }}
        />
        <WebsiteControlledInput
          name={setFormPath("business.website")}
          label="Business Website (optional)"
          control={control}
        />
        <BusinessInformationAddress />
      </div>
      <CardFormActionsWithSave
        onPrevious={goToPreviousForm}
        onNext={goToNextForm}
        onSave={onSave}
        isValid={isValid}
      />
    </div>
  );
};
