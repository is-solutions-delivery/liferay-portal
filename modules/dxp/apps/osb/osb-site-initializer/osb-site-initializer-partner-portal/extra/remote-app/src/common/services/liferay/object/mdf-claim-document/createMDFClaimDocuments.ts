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

import {Liferay} from '../..';
import MDFClaimDocuments from '../../../../interfaces/mdfClaimDocuments';
import getDTOFromMDFClaimDocument from '../../../../utils/dto/mdf-claim-document/getDTOFromMDFClaimDocument';
import {LiferayAPIs} from '../../common/enums/apis';
import liferayFetcher from '../../common/utils/fetcher';

export default async function createMDFClaimDocuments(
	mdfRClaimId: number,
	mdfClaimDocuments: MDFClaimDocuments[]
) {
	return await Promise.all(
		mdfClaimDocuments.map((document) =>
			liferayFetcher.post(
				`/o/${LiferayAPIs.OBJECT}/mdfclaimdocuments`,
				Liferay.authToken,
				getDTOFromMDFClaimDocument(document, mdfRClaimId)
			)
		)
	);
}
