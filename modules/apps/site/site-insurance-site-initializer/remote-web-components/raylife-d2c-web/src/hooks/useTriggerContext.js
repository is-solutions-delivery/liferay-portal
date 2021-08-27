import { useContext } from "react";
import { setSelectedTrigger } from "../context/actions";
import { AppContext } from "../context/AppContext";

export const useTriggerContext = () => {
    const { state: { selectedTrigger }, dispatch } = useContext(AppContext);

    const isSelected = (label) => {
        return label === selectedTrigger;
    }

    const updateState = (label) => {
        if (label === selectedTrigger) {
			dispatch(setSelectedTrigger(''));
		} else {
			dispatch(setSelectedTrigger(label));
		}
    }

    return {
        isSelected,
        updateState
    }
}