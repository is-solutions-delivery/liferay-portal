import { ActionTypes } from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_STEP:
      return {
        ...state,
        selectedStep: action.payload,
      };

    default:
      return state;
  }
};
