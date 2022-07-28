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

import i18n from '../../../../I18n';
import {Button} from '../../../../components';

const ConfirmationLXCMessageModal = ({handlePage}) => {
	return (
		<div className="d-flex flex-column p-4 w-40">
			<div className="mb-4">
				<p className="h2 mb-1">
					{i18n.translate('set-up-liferay-experience-cloud')}
				</p>

				<p className="text-paragraph-sm">
					{i18n.translate(
						'we-ll-need-a-few-details-to-finish-building-your-lxc-environment'
					)}
				</p>
			</div>

			<div className="mb-3">
				<p className="h5">
					{i18n.translate('thank-you-for-submitting-this-request')}
				</p>

				<p>
					{i18n.translate(
						'your-liferay-experience-cloud-workspace-will-be-provisioned-in-1-2-business-days-an-email-will-be-sent-once-your-project-is-ready'
					)}
				</p>
			</div>

			<div className="d-flex justify-content-center mb-1 mt-5">
				<Button onClick={() => handlePage(true)}>
					{i18n.translate('done')}
				</Button>
			</div>
		</div>
	);
};

export default ConfirmationLXCMessageModal;
