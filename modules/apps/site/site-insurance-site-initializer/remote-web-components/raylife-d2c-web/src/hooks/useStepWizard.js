/* eslint-disable react-hooks/exhaustive-deps */
import {useContext, useEffect} from 'react';
import {useFormContext, useWatch} from 'react-hook-form';

import {AppContext} from '../context/AppContext';
import {setSelectedStep} from '../context/actions';
import {TIP_EVENT} from '../events';
import {calculatePercentage, countCompletedFields} from '../utils';
import {businessTotalFields} from '../utils/businessFields';
import {AVAILABLE_STEPS, TOTAL_OF_FIELD} from '../utils/constants';
import {propertyTotalFields} from '../utils/propertyFields';
import {useCustomEvent} from './useCustomEvent';

export const useStepWizard = () => {
	const form = useWatch();
	const [dispatchEvent] = useCustomEvent(TIP_EVENT);
	const {state, dispatch} = useContext(AppContext);
	const {
		control: {_fields},
	} = useFormContext();

	useEffect(() => {
		_updateStepPercentage();
	}, [form]);

	useEffect(() => {
		dispatchEvent({
			hide: true,
		});
	}, [state.selectedStep.section]);

	const _updateStepPercentage = () => {
		switch (state.selectedStep.section) {
			case AVAILABLE_STEPS.BASICS_BUSINESS_TYPE.section:
				return setPercentage(
					calculatePercentage(
						countCompletedFields(_fields?.basics || {}),
						TOTAL_OF_FIELD.BASICS
					),
					AVAILABLE_STEPS.BASICS_BUSINESS_TYPE.section
				);

			case AVAILABLE_STEPS.BUSINESS.section:
				return setPercentage(
					calculatePercentage(
						countCompletedFields(_fields?.business || {}),
						businessTotalFields(form?.basics?.properties)
					),
					AVAILABLE_STEPS.BUSINESS.section
				);

			case AVAILABLE_STEPS.EMPLOYEES.section:
				let total = TOTAL_OF_FIELD.EMPLOYEES;

				if (form?.employees?.hasFein === 'true') {
					total++;
				}

				return setPercentage(
					calculatePercentage(
						countCompletedFields(_fields?.employees || {}),
						total
					),
					AVAILABLE_STEPS.EMPLOYEES.section
				);

			case AVAILABLE_STEPS.PROPERTY.section:
				return setPercentage(
					calculatePercentage(
						countCompletedFields(_fields?.property || {}),
						propertyTotalFields(form)
					),
					AVAILABLE_STEPS.PROPERTY.section
				);

			default:
				return setPercentage(
					0,
					AVAILABLE_STEPS.BASICS_BUSINESS_TYPE.section
				);
		}
	};

	const setSection = (step) =>
		dispatch(
			setSelectedStep({
				...state.selectedStep,
				...step,
			})
		);

	const setPercentage = (
		percentage = 0,
		step = AVAILABLE_STEPS.BASICS_BUSINESS_TYPE.section
	) =>
		dispatch(
			setSelectedStep({
				...state.selectedStep,
				percentage: {
					...state.selectedStep.percentage,
					[step]: percentage,
				},
			})
		);

	return {
		selectedStep: state.selectedStep,
		setPercentage,
		setSection,
	};
};
