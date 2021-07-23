/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import useDebounce from "lodash.debounce";

import { Input } from "../../../../fragments/Forms/Input";

export const BusinessTypeSearch = ({ searchBusinessType = () => {} }) => {
  const form = useWatch();
  const { register, setValue } = useFormContext();

  useEffect(() => {
    onSearch(form?.basics?.businessSearch);
  }, [form?.basics?.businessSearch]);

  const onSearch = useCallback(
    useDebounce((searchTerm = "") => {
      if (!searchTerm.length) setValue("basics.businessCategoryId", "");
      return searchBusinessType(searchTerm);
    }, 500),
    []
  );

  return (
    <div className="content-row">
      <Input
        label="Search for your primary industry and then select it from the list."
        defaultValue=""
        {...register("basics.businessSearch")}
      />
      <button
        className="btn btn-primary"
        onClick={() => onSearch(form?.basics?.businessSearch)}
        style={{ height: "3rem" }}
      >
        Search
      </button>
    </div>
  );
};
