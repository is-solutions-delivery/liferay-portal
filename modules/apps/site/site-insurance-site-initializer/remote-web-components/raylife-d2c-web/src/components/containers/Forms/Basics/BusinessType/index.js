import React, {useContext, useState} from 'react';
import {useFormContext} from 'react-hook-form';

import {setSelectedProduct} from '../../../../../context/actions';
import {AppContext} from '../../../../../context/AppContext';

import {useStepWizard} from '../../../../../hooks/useStepWizard';
import {AVAILABLE_STEPS, COOKIES} from '../../../../../utils/constants';
import {CardFormActionsWithSave} from '../../../../fragments/Card/FormActionsWithSave';
import {BusinessTypeSearch} from './Search';
import {smoothScroll} from '../../../../../utils/scroll';

export const FormBasicBusinessType = ({form}) => {
	const {setSection} = useStepWizard();
	const [newSelectedProduct, setNewSelectedProduct] = useState('');
	const {dispatch, state} = useContext(AppContext);
	const {setValue} = useFormContext();

	const goToNextForm = () => {
		setSection(AVAILABLE_STEPS.BASICS_BUSINESS_INFORMATION);

		if (state.selectedProduct !== newSelectedProduct) {
			setValue('business', '');
			dispatch(setSelectedProduct(newSelectedProduct));
		}

		smoothScroll();
	};

	const goToPreviousPage = () => {
		window.location.href = '/web/raylife';
		if (document.cookie.includes(COOKIES.BACK_TO_EDIT)) {
			document.cookie = `${COOKIES.BACK_TO_EDIT}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
		}
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
