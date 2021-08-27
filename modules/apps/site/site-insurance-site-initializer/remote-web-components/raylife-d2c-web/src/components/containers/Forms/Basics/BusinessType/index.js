import React from 'react';
import {useFormContext} from 'react-hook-form';

import {useStepWizard} from '../../../../../hooks/useStepWizard';
import {AVAILABLE_STEPS} from '../../../../../utils/constants';
import {BusinessTypeSearch} from './Search';
import {CardFormActionsWithSave} from '../../../../fragments/Card/FormActionsWithSave';

export const FormBasicBusinessType = ({form}) => {
	const {
		formState: {isValid},
	} = useFormContext();
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
				<BusinessTypeSearch form={form} />
			</div>
			<CardFormActionsWithSave
				onNext={goToNextForm}
				onPrevious={goToPreviousPage}
				isValid={!!form?.basics?.businessCategoryId}
			/>
		</div>
	);
};
