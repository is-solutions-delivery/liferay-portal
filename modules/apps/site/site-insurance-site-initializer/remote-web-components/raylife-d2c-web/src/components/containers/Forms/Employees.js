import React from "react";

import { Input } from "../../fragments/Forms/Input";
import { Switch } from "../../fragments/Forms/Switch";
import { AVAILABLE_STEPS } from "../../../utils/constants";
import { useStepWizard } from "../../../hooks/useStepWizard";
import { InputWithMask } from "../../fragments/Forms/Input/WithMask";
import { Controller, useFormContext, useWatch } from "react-hook-form";

const setFormPath = (value) => `employees.${value}`;

export const FormEmployees = () => {
  const form = useWatch();
  const { setSection } = useStepWizard();
  const {
    register,
    control,
    formState: { isValid },
  } = useFormContext();

  const goToPreviousForm = () => setSection(AVAILABLE_STEPS.BUSINESS);

  const goToNextForm = () => setSection(AVAILABLE_STEPS.PROPERTY);

  return (
    <div className="card">
      <div className="card-content">
        <Controller
          name={setFormPath("hasFein")}
          defaultValue="false"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Switch
              {...field}
              label="Does your business have a Federal Employer Identification Number (FEIN)?"
            />
          )}
        />
        {form?.employees?.hasFein === "true" && (
          <Controller
            name={setFormPath("fein")}
            defaultValue=""
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <InputWithMask
                {...field}
                renderActions={<button className="btn badge">More Info</button>}
                label="Federal Employer Identification Number (FEIN)"
                format="##-#######"
                mask="_"
              />
            )}
          />
        )}
        <Controller
          name={setFormPath("startBusinessAtYear")}
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputWithMask
              {...field}
              label="What year did you start your business?"
              format="####"
              mask="_"
            />
          )}
        />
        <Controller
          name={setFormPath("businessOperatesYearRound")}
          defaultValue="false"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Switch {...field} label="Does your business operate year round?" />
          )}
        />
        <Input
          name="partTimeEmployees"
          label="How many full or part time employees do you have?"
          renderActions={<button className="btn badge">More Info</button>}
          type="number"
          min={0}
          {...register(setFormPath("partTimeEmployees"), {
            required: true,
            min: 0,
          })}
        />
        <Controller
          name={setFormPath("estimatedAnnualGrossRevenue")}
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputWithMask
              {...field}
              label="What is your estimated annual gross revenue for the next 12 months?"
              prefix="$"
              decimalScale={2}
              thousandSeparator
              fixedDecimalScale
            />
          )}
        />
        <Controller
          name={setFormPath("annualPayrollForOwner")}
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputWithMask
              {...field}
              label="What do you anticipate your annual payroll will be for all owner(s) over the next 12 months?"
              prefix="$"
              decimalScale={2}
              thousandSeparator
              fixedDecimalScale
            />
          )}
        />
        <Controller
          name={setFormPath("annualPayrollForEmployees")}
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputWithMask
              {...field}
              label="What do you anticipate your annual payroll will be for all employees over the next 12 months?"
              prefix="$"
              decimalScale={2}
              thousandSeparator
              fixedDecimalScale
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
