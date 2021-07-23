import React, { createContext, useReducer } from "react";

import { reducer } from "./reducer";

const initialState = {
  selectedStep: {
    title: "Welcome! Let's start.",
    section: "basics",
    subsection: "business-type",
    percentage: 0,
  },
};

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
