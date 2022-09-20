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

import documentAndMediaFolder from '../../../common/interfaces/documentAndMediaFolder';
import {Liferay} from '../../../common/services/liferay';
import {LiferayAPIs} from '../../../common/services/liferay/common/enums/apis';
import LiferayItems from '../../../common/services/liferay/common/interfaces/liferayItems';
import liferayFetcher from '../../../common/services/liferay/common/utils/fetcher';

export async function createFolder(
	siteId: number,
	folderName: string,
	idMainFolder: number
): Promise<documentAndMediaFolder> {
	const folderExist = await liferayFetcher<
		LiferayItems<documentAndMediaFolder[]>
	>(
		idMainFolder > 0
			? `/o/${
					LiferayAPIs.HEADERLESS_DELIVERY
			  }/document-folders/${idMainFolder}/document-folders/${`?filter=contains(name, '${folderName}')`}`
			: `/o/${
					LiferayAPIs.HEADERLESS_DELIVERY
			  }/sites/${siteId}/document-folders/${`?filter=contains(name, '${folderName}')`}`,
		Liferay.authToken
	);

	let folder = folderExist?.items[0];

	if (folderExist?.totalCount === 0) {
		const response = await liferayFetcher.post<documentAndMediaFolder>(
			idMainFolder > 0
				? `/o/${LiferayAPIs.HEADERLESS_DELIVERY}/document-folders/${idMainFolder}/document-folders`
				: `/o/${LiferayAPIs.HEADERLESS_DELIVERY}/sites/${siteId}/document-folders`,
			Liferay.authToken,
			{
				description: folderName,
				name: folderName,
			}
		);

		folder = response;
	}

	return folder;
}
