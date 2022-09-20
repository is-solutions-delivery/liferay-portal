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

import {Liferay} from '../../../common/services/liferay';
import {LiferayAPIs} from '../../../common/services/liferay/common/enums/apis';
import liferayFetcher from '../../../common/services/liferay/common/utils/fetcher';

export default async function createDocumentInFolder(
	folderId: number,
	fileEntry: string
) {
	const formData = new FormData();

	formData.append('file', fileEntry);

	return liferayFetcher.post(
		`/o/${LiferayAPIs.HEADERLESS_DELIVERY}/document-folders/${folderId}/documents`,
		Liferay.authToken,
		formData
	);
}
