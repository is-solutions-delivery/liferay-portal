/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useNavigate} from 'react-router-dom';

import {Header} from '../../../../components/Header/Header';
import {NewAppPageFooterButtons} from '../../../../components/NewAppPageFooterButtons/NewAppPageFooterButtons';
import i18n from '../../../../i18n';
import {Liferay} from '../../../../liferay/liferay';

const ContatctSalesPage = () => {
	const navigate = useNavigate();

	return (
		<div>
			<Header
				description={
					<p>
						{i18n.translate(
							'the-selected-project-does-not-meet-the-necessary-resource-requirements-for-this-app-Please-contact-sales-to-request-additional-resources'
						)}
					</p>
				}
				title={i18n.translate('insufficient-resource-requirements')}
			/>
			<NewAppPageFooterButtons
				backButtonText={i18n.translate('go-to-marketplace')}
				continueButtonText={i18n.translate('contact-sales')}
				onClickBack={() => {
					window.location.href = Liferay.ThemeDisplay.getCanonicalURL().replace(
						'/get-app',
						''
					);
				}}
				onClickContinue={() => {
					navigate('form');
				}}
				showBackButton={true}
				showContinueButton={true}
			/>

			<div className="d-flex justify-content-end">
				<a href="#">
					<ins>
						{i18n.translate(
							'learn-more-about-app-resource-requirements'
						)}
					</ins>
				</a>
			</div>
		</div>
	);
};

export default ContatctSalesPage;
