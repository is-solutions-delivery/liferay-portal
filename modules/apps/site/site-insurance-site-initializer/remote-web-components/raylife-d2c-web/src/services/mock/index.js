import { US_STATES, LEGAL_ENTITIES } from "./data";

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

const getLegalEntities = () =>
  new Promise((resolve) => {
    resolve(LEGAL_ENTITIES);
});

export const MockService = {
  getUSStates,
  getLegalEntities
};
