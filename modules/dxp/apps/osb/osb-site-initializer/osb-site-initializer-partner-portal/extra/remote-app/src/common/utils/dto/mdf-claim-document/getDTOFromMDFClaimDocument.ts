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

import mdfClaimDocumentDTO from '../../../interfaces/dto/mdfClaimDocumentDTO';
import MDFClaimDocuments from '../../../interfaces/mdfClaimDocuments';

export default function getDTOFromMDFClaimDocument(
	mdfClaimDocument: MDFClaimDocuments,
	mdfRClaimId: number
): mdfClaimDocumentDTO {
	return {
		url: mdfClaimDocument.fileURL,
		r_mdfClaimToMdfClaimDocuments_c_mdfClaimActivityId:
			mdfClaimDocument.idActivity,
		r_mdfClaimToMdfClaimDocuments_c_mdfClaimBudgetId:
			mdfClaimDocument.idBudget,
		r_mdfClaimToMdfClaimDocuments_c_mdfClaimId: mdfRClaimId,
	};
}
