/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {PermissionActionTypeTest} from '../../routes/MDFClaimManagerStatus';
import {PermissionActionType} from '../enums/permissionActionType';
import LiferayObject from './liferayObject';

export default interface PermissionAction extends LiferayObject {
	action: PermissionActionTypeTest;
	object: string;
}
