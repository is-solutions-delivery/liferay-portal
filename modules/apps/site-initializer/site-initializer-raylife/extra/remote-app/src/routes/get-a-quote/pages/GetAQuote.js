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

	const isMobile = dimensions.deviceSize === DEVICES.PHONE;

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
		// muchbetter

		const logoRaylifeElement = document.querySelector(
			'.quote-site-navbar .container img.navbar-logo'
		);

		const contentElement = document.querySelector('section#content');

		if (isMobile) {
			contentElement.setAttribute('class', 'test');

			logoRaylifeElement.setAttribute(
				'src',
				`${getWebDavUrl()}/raylife_logo_mobile.svg`
			);

			return;
		}

		logoRaylifeElement.setAttribute(
			'src',
			`${getWebDavUrl()}/raylife_logo.svg`
		);
	}, [isMobile]);

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
