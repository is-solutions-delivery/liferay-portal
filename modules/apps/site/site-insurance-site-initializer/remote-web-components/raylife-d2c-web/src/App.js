import {AVAILABLE_STEPS} from './utils/constants';
import {Forms} from './components/containers/Forms';
import {Steps} from './components/containers/Steps';
import {useStepWizard} from './hooks/useStepWizard';
import {useWatch} from 'react-hook-form';
import React from 'react';

export const App = () => {
	const form = useWatch();
	const {selectedStep} = useStepWizard();

	const _renderTitle = () => {
		if (selectedStep.section !== AVAILABLE_STEPS.PROPERTY.section)
			return selectedStep.title;
		else
			return (
				<>
					{selectedStep.title}
					<span className="primary">
						{
							form.basics.businessInformation.business.location
								.address
						}
					</span>
				</>
			);
	};

	return (
		<div className="form-area">
			<Steps />
			<h2 className="title title-area">{_renderTitle()}</h2>
			<Forms />
			<div className="info-area"></div>
		</div>
	);
};
