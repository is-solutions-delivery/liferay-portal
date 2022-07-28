/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import ClayModal from '@clayui/modal';
import React, {useState} from 'react';
import i18n from '../../../../../common/I18n';
import SetupLXCForm from '../../../../../common/containers/setup-forms/SetupLXCForm';
import {useAppPropertiesContext} from '../../../../../common/contexts/AppPropertiesContext';
import AlreadySubmittedFormModal from '../AlreadySubmittedModal';

const submittedModalTexts = {
	paragraph: i18n.translate(
		'return-to-the-product-activation-page-to-view-the-current-activation-status'
	),
	subtitle: i18n.translate(
		'we-ll-need-a-few-details-to-finish-building-your-lxc-environment'
	),
	text: i18n.translate(
		'another-user-already-submitted-the-lxc-activation-request'
	),
	title: i18n.translate('set-up-lxc'),
};

const SetupLXCModal = ({observer, onClose, project, subscriptionGroupId}) => {
	const [formAlreadySubmitted, setFormAlreadySubmitted] = useState(false);
	const {client} = useAppPropertiesContext();

	return (
		<ClayModal center observer={observer}>
			{formAlreadySubmitted ? (
				<AlreadySubmittedFormModal
					onClose={onClose}
					submittedModalTexts={submittedModalTexts}
				/>
			) : (
				<SetupLXCForm
					client={client}
					handlePage={onClose}
					leftButton={i18n.translate('cancel')}
					project={project}
					setFormAlreadySubmitted={setFormAlreadySubmitted}
					subscriptionGroupId={subscriptionGroupId}
				/>
			)}
		</ClayModal>
	);
};

export default SetupLXCModal;
