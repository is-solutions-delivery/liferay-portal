import React, { createContext, useEffect, useReducer } from "react";
import { TIP_EVENT_DISMISS } from "../events";
import { setSelectedTrigger } from "./actions";

import { reducer } from "./reducer";

const initialState = {
  selectedStep: {
    title: "Welcome! Let's start.",
    section: "basics",
    subsection: "business-type",
    percentage: 0,
  },
  selectedTrigger: ""
};

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const onDismiss = () => dispatch(setSelectedTrigger(""));


    window.addEventListener(
      TIP_EVENT_DISMISS, onDismiss
    );

    return () => window.removeEventListener(
      TIP_EVENT_DISMISS, onDismiss
    );
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
