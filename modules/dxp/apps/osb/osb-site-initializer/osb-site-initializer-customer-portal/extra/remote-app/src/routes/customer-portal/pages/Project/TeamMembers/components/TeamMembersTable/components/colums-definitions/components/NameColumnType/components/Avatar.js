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

import {useAppPropertiesContext} from '../../../../../../../../../../../../common/contexts/AppPropertiesContext';
import {getInitials} from './utils/getInitials';
import {getMd5Hash} from './utils/getMd5Hash';

const AVATAR_SIZE_IN_PX = 40;

const Avatar = ({emailAddress, userName}) => {
	const {gravatarAPI} = useAppPropertiesContext();
	const emailAddressMD5 = getMd5Hash(emailAddress);
	const uiAvatarURL = `https://ui-avatars.com/api/${getInitials(
		userName
	)}/128/0B5FFF/FFFFFF/2/0.33/true/true/true`;

	return (
		<div className="cp-team-members-avatar mr-2">
			<img
				height={AVATAR_SIZE_IN_PX}
				src={`${gravatarAPI}/${emailAddressMD5}?d=${encodeURIComponent(
					uiAvatarURL
				)}`}
				width={AVATAR_SIZE_IN_PX}
			/>
		</div>
	);
};

export default Avatar;
