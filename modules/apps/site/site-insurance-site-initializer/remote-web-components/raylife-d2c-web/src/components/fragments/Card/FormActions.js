import React from "react";

export const CardFormActions = ({
  onPrevious = () => {},
  onNext = () => {},
  isValid = false,
}) => {
  return (
    <div className="card-actions">
      <button type="button" className="btn btn-flat" onClick={onPrevious}>
        Previous
      </button>
      <div>
        <button
          type="submit"
          className="btn btn-secondary"
          onClick={onNext}
          disabled={!isValid}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
