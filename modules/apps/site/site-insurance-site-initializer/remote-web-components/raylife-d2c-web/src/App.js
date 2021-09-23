import React, {useEffect} from 'react';
import {useWatch} from 'react-hook-form';

import {Forms} from './components/containers/Forms';
import {Steps} from './components/containers/Steps';
import {useStepWizard} from './hooks/useStepWizard';
import {useTriggerContext} from './hooks/useTriggerContext';
import {AVAILABLE_STEPS} from './utils/constants';

export const App = () => {
	const form = useWatch();
	const {selectedStep} = useStepWizard();
	const {updateState} = useTriggerContext();

	const _renderTitle = () => {
		if (selectedStep.section !== AVAILABLE_STEPS.PROPERTY.section) {
			return selectedStep.title;
		} else {
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
		}
	};

	useEffect(() => {
		updateState('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedStep.section, selectedStep.subsection]);

	return (
		<>
			<div className="form-area">
				<Steps />
				<div>
					<h2 className="title title-area">{_renderTitle()}</h2>
					<Forms form={form} />
				</div>
				<div className="info-area"></div>
			</div>
		</>
	);
};
