/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { LiferayService } from "../services/liferay";

export const useProductQuotes = () => {
  const form = useWatch();
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    _loadProductQuotes();
  }, []);

  const _loadProductQuotes = async () => {
    try {
      const categoryId = form.basics.businessCategoryId;
      const response = await LiferayService.getProductQuotes(categoryId);
      setData(response);
    } catch (error) {
      setError(error);
    }
  };

  return {
    productQuotes: data || [],
    isLoading: !data && !error,
    isError: error,
  };
};
