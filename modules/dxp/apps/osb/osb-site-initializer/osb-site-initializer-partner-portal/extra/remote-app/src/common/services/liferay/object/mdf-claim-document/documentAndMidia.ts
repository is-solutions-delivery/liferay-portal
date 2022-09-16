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

import useSWR from 'swr';
import {Liferay} from '../..';
import documentAndMidiaFolder from '../../../../interfaces/documentAndMidiaFolder';
import {LiferayAPIs} from '../../common/enums/apis';
import LiferayItems from '../../common/interfaces/liferayItems';
import liferayFetcher from '../../common/utils/fetcher';

export async function createDocumentFolder(
	data: documentAndMidiaFolder,
	siteId: string
) {
	return await liferayFetcher.post(
		`/o/${LiferayAPIs.HEADERLESS_DELIVERY}/sites/${siteId}/document-folders`,
		Liferay.authToken,
		data
	);
}

const getDocumentFolders = (siteId: string, filter: string) => {
	return useSWR(
		[
			`/o/${LiferayAPIs.HEADERLESS_DELIVERY}/sites/${siteId}/document-folders/${filter}`,
			Liferay.authToken,
		],
		(url, token) =>
			liferayFetcher<LiferayItems<documentAndMidiaFolder>>(url, token)
	);
};

export async function createFolderIfNotExist(
	siteId: string,
	folderName: string
) {
	let folder;

	const folderExist = await getDocumentFolders(
		siteId,
		`?filter=contains(name, '${folderName}')`
	);

	return folderExist;
}
