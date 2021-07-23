export const ActionTypes = {
  SET_SELECTED_STEP: "SET_SELECTED_STEP",
};

/**
 * @param {{
 *  title: string,
 *  section: string,
 *  subsection: string,
 *  percentage: number,
 * }} payload - selectedStep
 * @returns {Object} action object used by the reducer
 */
export const setSelectedStep = (payload) => {
  return {
    type: ActionTypes.SET_SELECTED_STEP,
    payload,
  };
};
