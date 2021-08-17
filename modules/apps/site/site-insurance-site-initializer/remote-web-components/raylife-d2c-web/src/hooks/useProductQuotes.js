/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { LiferayService } from "../services/liferay";
import Cookies from 'js-cookie';

export const useProductQuotes = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    _loadProductQuotes();
  }, []);

  const _loadProductQuotes = async () => {
    try {
      const categoryId = Cookies.get('raylife-product');;
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
