import React, {useContext, useEffect, useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {setSelectedProduct} from '../../../../../context/actions';
import {AppContext} from '../../../../../context/AppContext';

import {useStepWizard} from '../../../../../hooks/useStepWizard';
import {AVAILABLE_STEPS, COOKIES} from '../../../../../utils/constants';
import {CardFormActionsWithSave} from '../../../../fragments/Card/FormActionsWithSave';
import {BusinessTypeSearch} from './Search';

import Cookie from 'js-cookie';

export const FormBasicBusinessType = ({form}) => {
	const {setSection} = useStepWizard();
	const [newSelectedProduct, setNewSelectedProduct] = useState('');
	const {dispatch, state} = useContext(AppContext);
	const {setValue} = useFormContext();

	useEffect(() => {
		if (
			Cookie.get(COOKIES.BACK_TO_EDIT) &&
			JSON.parse(Cookie.get(COOKIES.BACK_TO_EDIT))
		) {
			loadSections();
		}
	});

	const loadSections = () => {
		const stepName = Object.keys(form)[
			Object.keys(form).length - 1
		].toLowerCase();
		switch (stepName) {
			case 'basics':
				const stepBasicName = Object.keys(form?.basics)[
					Object.keys(form?.basics).length - 1
				].toLowerCase();

				if (stepBasicName === 'businessInformation') {
					setSection(AVAILABLE_STEPS.BASICS_BUSINESS_INFORMATION);
				} else if (stepBasicName === 'business-type') {
					setSection(AVAILABLE_STEPS.BASICS_BUSINESS_TYPE);
				} else {
					setSection(AVAILABLE_STEPS.BASICS_PRODUCT_QUOTE);
				}
				break;
			case 'business':
				setSection(AVAILABLE_STEPS.BUSINESS);
				break;
			case 'employees':
				setSection(AVAILABLE_STEPS.EMPLOYEES);
				break;
			case 'property':
				setSection(AVAILABLE_STEPS.PROPERTY);
				break;
			default:
				break;
		}
	};

	const goToNextForm = () => {
		setSection(AVAILABLE_STEPS.BASICS_BUSINESS_INFORMATION);

		if (state.selectedProduct !== newSelectedProduct) {
			setValue('business', '');
			dispatch(setSelectedProduct(newSelectedProduct));
		}
	};

	const goToPreviousPage = () => {
		window.history.back();
	};

	return (
		<div className="card">
			<div className="card-content">
				<BusinessTypeSearch
					form={form}
					setNewSelectedProduct={setNewSelectedProduct}
				/>
			</div>
			<CardFormActionsWithSave
				isValid={!!form?.basics?.businessCategoryId}
				onNext={goToNextForm}
				onPrevious={goToPreviousPage}
			/>
		</div>
	);
};
