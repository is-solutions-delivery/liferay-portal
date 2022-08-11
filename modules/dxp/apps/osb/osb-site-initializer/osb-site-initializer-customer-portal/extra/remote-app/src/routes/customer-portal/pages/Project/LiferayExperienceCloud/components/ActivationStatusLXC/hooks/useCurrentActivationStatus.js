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

import {Button, ButtonWithIcon} from '@clayui/core';
import {Align} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import {useState} from 'react';

import i18n from '../../../../../../../../common/I18n';
import {ButtonDropDown} from '../../../../../../../../common/components';
import {
	STATUS_TAG_TYPES,
	STATUS_TAG_TYPE_NAMES,
} from '../../../../../../utils/constants';

export default function useCurrentActivationStatus(
	lxcEnvironment,
	userAccount,
	subscriptionGroupActivationStatus
) {
	const [visibleStatus, setVisibleStatus] = useState(false);
	const [visibleSetup, setVisibleSetup] = useState(false);

	const currentActivationStatus = {
		[STATUS_TAG_TYPE_NAMES.active]: {
			buttonLink: (
				<a
					className="font-weight-semi-bold m-0 p-0 text-brand-primary text-paragraph"
					href={`https://console.liferay.cloud/projects/${lxcEnvironment?.projectId}/overview`}
					rel="noopener noreferrer"
					target="_blank"
				>
					{i18n.translate('go-to-product-console')}

					<ClayIcon className="ml-1" symbol="order-arrow-right" />
				</a>
			),
			id: STATUS_TAG_TYPES.active,
			subtitle: i18n.translate(
				'Your Experience Cloud environments are ready.'
			),
			title: i18n.translate('activation-status'),
		},
		[STATUS_TAG_TYPE_NAMES.inProgress]: {
			dropdownIcon: userAccount.isStaff && userAccount.isProvisioning && (
				<ButtonDropDown
					align={Align.BottomRight}
					customDropDownButton={
						<ButtonWithIcon
							displayType="null"
							small
							symbol="caret-bottom"
						/>
					}
					items={[
						{
							label: i18n.translate('set-to-active'),
							onClick: () => setVisibleStatus(true),
						},
					]}
					menuElementAttrs={{
						className: 'p-0 cp-activation-key-icon rounded-xs',
					}}
				/>
			),
			id: STATUS_TAG_TYPES.inProgress,
			subtitle: i18n.translate(
				'Your Experience Cloud project is being set up and will be available soon.'
			),
			title: i18n.translate('activation-status'),
		},
		[STATUS_TAG_TYPE_NAMES.notActivated]: {
			buttonLink: userAccount.isAdmin && (
				<Button
					appendIcon="order-arrow-right"
					className="btn btn-link font-weight-semi-bold p-0 text-brand-primary text-paragraph"
					displayType="link"
					onClick={() => setVisibleSetup(true)}
				>
					{i18n.translate('finish-activation')}
				</Button>
			),
			id: STATUS_TAG_TYPES.notActivated,
			subtitle: i18n.translate(
				'Almost there! Setup Experience Cloud by finishing the activation form.'
			),
			title: i18n.translate('activation-status'),
		},
	};

	const activationStatus =
		currentActivationStatus[
			subscriptionGroupActivationStatus ||
				STATUS_TAG_TYPE_NAMES.notActivated
		];

	return {
		activationStatus,
		visibleSetup,
		visibleStatus,
	};
}
