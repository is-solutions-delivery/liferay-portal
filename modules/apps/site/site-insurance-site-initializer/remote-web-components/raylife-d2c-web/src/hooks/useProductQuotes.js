import { useEffect, useState } from "react";
import { MockService } from "../services/mock";

export const useProductQuotes = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    _loadProductQuotes();
  }, []);

  const _loadProductQuotes = async () => {
    try {
      const response = await MockService.getProductQuotes();
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
