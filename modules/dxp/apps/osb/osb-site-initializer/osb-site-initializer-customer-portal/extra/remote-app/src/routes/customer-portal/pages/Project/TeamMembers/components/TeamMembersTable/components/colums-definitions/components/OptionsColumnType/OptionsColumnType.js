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

import {ButtonWithIcon} from '@clayui/core';
import {ButtonDropDown} from '../../../../../../../../../../../common/components';
import {getIsEditingUser} from '../commom/utils/getIsEditingUser';
import MenuUserActions from './components/MenuUserActions/MenuUserActions';
import {getUserOptions} from './utils/getUserOptions';

const OptionsColumnType = ({
	confirmChanges,
	setSelectedRole,
	setUserAction,
	userAccount,
	userAction,
}) => {
	const userOptions = getUserOptions(userAccount, setUserAction);

	const isEditingUser = getIsEditingUser(userAction, userAccount?.id);

	return isEditingUser ? (
		<MenuUserActions
			confirmChanges={confirmChanges}
			setSelectedRole={setSelectedRole}
			setUserAction={setUserAction}
			userAccount={userAccount}
		/>
	) : (
		<ButtonDropDown
			customDropDownButton={
				<ButtonWithIcon displayType="null" small symbol="ellipsis-v" />
			}
			items={userOptions}
			menuElementAttrs={{
				className: 'p-0',
			}}
		/>
	);
};

export {OptionsColumnType};
