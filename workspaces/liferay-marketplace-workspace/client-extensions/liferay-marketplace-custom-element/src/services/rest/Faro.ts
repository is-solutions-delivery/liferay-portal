/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fetcher from '../fetcher';

export async function getDataSourceToken(groupId: string): Promise<string> {
	const response = await fetcher<string | {token: string}>(
		`o/faro/contacts/${groupId}/data_source/token`
	);

	return typeof response === 'string' ? response : response?.token ?? '';
}
