import { US_STATES } from "./data";

/**
 * @returns {Promise<{
 * name: string
 * abbreviation: string
 * }[]>} Array with all US states
 */
const getUSStates = () =>
  new Promise((resolve) => {
    resolve(US_STATES);
  });

export const MockService = {
  getUSStates,
};
