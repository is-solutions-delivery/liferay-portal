/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { LiferayService } from "../services/liferay";

export const useBusinessTypes = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    loadBusinessTypes();
  }, []);

  const loadBusinessTypes = async (search = "") => {
    try {
      if (!search.length) return reset();

      const response = await LiferayService.getBusinessTypes(search);
      return setData(response);
    } catch (error) {
      console.warn(error);
      return setError(error);
    }
  };

  const reset = () => {
    setData(undefined);
    setError(undefined);
  };

  return {
    businessTypes: data || [],
    isLoading: !data && !error,
    isError: error,
    reload: loadBusinessTypes,
  };
};
