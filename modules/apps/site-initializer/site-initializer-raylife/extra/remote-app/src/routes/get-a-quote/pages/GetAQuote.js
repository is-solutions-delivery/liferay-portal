import React, {useContext, useEffect} from 'react';
import {useWatch} from 'react-hook-form';
import {DEVICES} from '../../../common/utils/constants';

import {createExitAlert} from '../../../common/utils/exitAlert';
import {getWebDavUrl} from '../../../common/utils/webdav';
import Providers from '../Providers';
import {Forms} from '../components/containers/Forms';
import {Steps} from '../components/containers/Steps';
import {AppContext} from '../context/AppContextProvider';
import {useStepWizard} from '../hooks/useStepWizard';
import {useTriggerContext} from '../hooks/useTriggerContext';

import {AVAILABLE_STEPS} from '../utils/constants';

const QuoteApp = () => {
	const form = useWatch();
	const {selectedStep} = useStepWizard();
	const {updateState} = useTriggerContext();
	const {
		state: {dimensions},
	} = useContext(AppContext);

	const isMobileDevice = dimensions.deviceSize === DEVICES.PHONE;

	const FormTitle = () => {
		if (selectedStep.section !== AVAILABLE_STEPS.PROPERTY.section) {
			return selectedStep.title;
		}

		return (
			<>
				{selectedStep.title}{' '}
				<span className="primary">
					{form.basics.businessInformation.business.location.address}
				</span>
			</>
		);
	};

	useEffect(() => {
		createExitAlert();
	});

	useEffect(() => {
		updateState('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedStep.section, selectedStep.subsection]);

	useEffect(() => {
		const logoRaylifeElement = document.querySelector(
			'.quote-site-navbar .container img.navbar-logo'
		);

		const contentElement = document.querySelector('section#content');

		const stepElement = document.querySelector(
			'.get-a-quote-structure .step-list'
		);

		if (isMobileDevice) {
			contentElement.setAttribute('class', 'raylife-mobile');

			logoRaylifeElement.setAttribute(
				'src',
				`${getWebDavUrl()}/raylife_logo_mobile.svg`
			);

			stepElement.setAttribute(
				'style',
				'overflow-x: auto; overflow-y: hidden; height: 40px; justify-content: start;'
			);

			return;
		}

		stepElement.setAttribute('style', 'justify-content-center');

		logoRaylifeElement.setAttribute(
			'src',
			`${getWebDavUrl()}/raylife_logo.svg`
		);
	}, [isMobileDevice]);

	return (
		<div className="d-flex get-a-quote-structure justify-content-between">
			<Steps />

			<main>
				<h2 className="display-4 mb-6 mx-6">
					<FormTitle />
				</h2>

				<Forms form={form} />
			</main>
		</div>
	);
};

const GetAQuote = () => (
	<Providers>
		<QuoteApp />
	</Providers>
);

export default GetAQuote;
