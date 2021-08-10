import React from 'react';
import {useFormContext, useWatch} from 'react-hook-form';

import {useStepWizard} from '../../../../../hooks/useStepWizard';
import {AVAILABLE_STEPS} from '../../../../../utils/constants';
import {BusinessTypeSearch} from './Search';
import {CardFormActions} from '../../../../fragments/Card/FormActions';

export const FormBasicBusinessType = () => {
	const {
		formState: {isValid},
	} = useFormContext();
	const form = useWatch();
	const {setSection} = useStepWizard();

	const goToNextForm = () => {
		setSection(AVAILABLE_STEPS.BASICS_BUSINESS_INFORMATION);
	};

	const goToPreviousPage = () => {
		window.history.back();
	};

	return (
		<div className="card">
			<div className="card-content">
				<BusinessTypeSearch />
			</div>
			<CardFormActions
				onNext={goToNextForm}
				onPrevious={goToPreviousPage}
				isValid={isValid && form?.basics?.businessClassCode}
			/>
		</div>
	);
};
