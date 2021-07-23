import React from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";

import { Radio } from "../../../fragments/Forms/Radio";
import { AVAILABLE_STEPS } from "../../../../utils/constants";
import { useStepWizard } from "../../../../hooks/useStepWizard";
import { useProductQuotes } from "../../../../hooks/useProductQuotes";
import { useLiferayState } from "../../../../hooks/useLiferayState";

const QUOTE_ATOM = "product-quote-id";

export const FormBasicProductQuote = () => {
  const form = useWatch();
  const { writeAtom } = useLiferayState();
  const { setSection } = useStepWizard();
  const { productQuotes } = useProductQuotes();
  const {
    control,
    formState: { isValid },
  } = useFormContext();

  const goToNextForm = () => setSection(AVAILABLE_STEPS.BUSINESS);

  const goToPreviousForm = () =>
    setSection(AVAILABLE_STEPS.BASICS_BUSINESS_INFORMATION);

  return (
    <div className="card">
      <div className="card-content">
        <div className="content-column">
          <label>Select a product to quote.</label>
          <fieldset id="productQuote" className="content-column">
            <Controller
              name="basics.productQuote"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={({ field }) =>
                productQuotes.map((quote) => (
                  <Radio
                    {...field}
                    key={quote.id}
                    label={quote.title}
                    sideLabel={quote.period}
                    description={quote.description}
                    value={quote.id}
                    selected={quote.id === form.basics.productQuote}
                    renderActions={
                      <button
                        type="button"
                        className="btn badge"
                        onClick={() => writeAtom(QUOTE_ATOM, quote.id)}
                      >
                        More Info
                      </button>
                    }
                  />
                ))
              }
            />
          </fieldset>
        </div>
      </div>
      <div className="card-actions" style={{ justifyContent: "center" }}>
        <button
          type="button"
          className="btn btn-flat"
          onClick={goToPreviousForm}
        >
          Previous
        </button>
        <button
          type="submit"
          className="btn btn-secondary"
          onClick={goToNextForm}
          disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
