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
import i18n from '../../../../../../../../../../../../common/I18n';
import {TEAM_MEMBERS_ACTION_TYPES} from '../../../../../utils/constants';

export function getUserOptions(userAccount, setUserAction) {
	const userOptions = [
		{
			label: i18n.translate('edit'),
			onClick: () =>
				setUserAction({
					type: TEAM_MEMBERS_ACTION_TYPES.edit,
					userId: userAccount?.id,
				}),
		},
		{
			customOptionStyle: 'cp-remove-member-option',
			label: i18n.translate('remove'),
			onClick: () =>
				setUserAction({
					type: TEAM_MEMBERS_ACTION_TYPES.remove,
					userId: userAccount?.id,
				}),
		},
	];

	return userOptions;
}
