import React from 'react';
import {useFormContext, useWatch} from 'react-hook-form';

import {Steps} from './components/containers/Steps';
import {Forms} from './components/containers/Forms';
import {useStepWizard} from './hooks/useStepWizard';
import {AVAILABLE_STEPS} from './utils/constants';

export const App = () => {
	const form = useWatch();
	const {handleSubmit} = useFormContext();
	const {selectedStep} = useStepWizard();

	/**
	 * @state disabled for now
	 * @param {*} data
	 */
	const onSubmit = (data) => {
		// console.log(data);
		// window.location.href = '/web/raylife/hang-tight';
	};

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
		<>
			<div className="form-area">
				<Steps />
				<form onSubmit={handleSubmit(onSubmit)}>
					<h2 className="title title-area">{_renderTitle()}</h2>
					<Forms />
				</form>
			</div>
		</>
	);
};
