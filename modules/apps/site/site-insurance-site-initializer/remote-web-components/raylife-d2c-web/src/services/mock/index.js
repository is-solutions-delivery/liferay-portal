import { PRODUCT_QUOTES, US_STATES } from "./data";

const MOCK_TIMEOUT = 200;

/**
 * @returns {Promise<{
 * id: string
 * title: string
 * period: string
 * description: string
 * }[]>} Array of product quotes
 */
const getProductQuotes = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(PRODUCT_QUOTES);
    }, MOCK_TIMEOUT);
  });

/**
 * @returns {Promise<{
 * name: string
 * abbreviation: string
 * }[]>} Array with all US states
 */
const getUSStates = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(US_STATES);
    }, MOCK_TIMEOUT);
  });

export const MockService = {
  getProductQuotes,
  getUSStates,
};
