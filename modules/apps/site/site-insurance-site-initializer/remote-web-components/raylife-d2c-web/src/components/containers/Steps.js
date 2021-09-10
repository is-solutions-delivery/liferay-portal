import React from 'react';

import {useStepWizard} from '../../hooks/useStepWizard';
import {AVAILABLE_STEPS} from '../../utils/constants';
import {StepItem} from '../fragments/Step/Item';
import {StepList} from '../fragments/Step/List';

export const Steps = () => {
	const {selectedStep,setSection} = useStepWizard();

	return (
		<StepList>
			<StepItem
				percentage={
					selectedStep.percentage[
						AVAILABLE_STEPS.BASICS_BUSINESS_TYPE.section
					]
				}
				selected={
					selectedStep.section ===
					AVAILABLE_STEPS.BASICS_BUSINESS_TYPE.section
				}
				onClick={() => setSection(AVAILABLE_STEPS.BASICS_BUSINESS_TYPE)}
			>
				Basics
			</StepItem>
			<StepItem
				percentage={
					selectedStep.percentage[AVAILABLE_STEPS.BUSINESS.section]
				}
				selected={
					selectedStep.section === AVAILABLE_STEPS.BUSINESS.section
				}
				onClick={() => setSection(AVAILABLE_STEPS.BUSINESS)}
			>
				Business
			</StepItem>
			<StepItem
				percentage={
					selectedStep.percentage[AVAILABLE_STEPS.EMPLOYEES.section]
				}
				selected={
					selectedStep.section === AVAILABLE_STEPS.EMPLOYEES.section
				}
				onClick={() => setSection(AVAILABLE_STEPS.EMPLOYEES)}
			>
				Employees
			</StepItem>
			<StepItem
				percentage={
					selectedStep.percentage[AVAILABLE_STEPS.PROPERTY.section]
				}
				selected={
					selectedStep.section === AVAILABLE_STEPS.PROPERTY.section
				}
				onClick={() => setSection(AVAILABLE_STEPS.PROPERTY)}
			>
				Property
			</StepItem>
		</StepList>
	);
};
