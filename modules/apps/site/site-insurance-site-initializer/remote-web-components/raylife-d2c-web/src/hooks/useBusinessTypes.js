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
      const response = await LiferayService.getBusinessTypes(search);
      setData(response);
    } catch (error) {
      console.warn(error);
      setError(error);
    }
  };

  return {
    businessTypes: data || [],
    isLoading: !data && !error,
    isError: error,
    reload: loadBusinessTypes,
  };
};
