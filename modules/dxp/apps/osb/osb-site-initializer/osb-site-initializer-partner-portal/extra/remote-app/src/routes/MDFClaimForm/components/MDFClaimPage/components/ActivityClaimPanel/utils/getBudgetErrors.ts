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

import {FormikErrors} from 'formik';

import MDFClaim from '../../../../../../../common/interfaces/mdfClaim';
import MDFClaimActivity from '../../../../../../../common/interfaces/mdfClaimActivity';
import MDFClaimBudget from '../../../../../../../common/interfaces/mdfClaimBudget';

export default function getBudgetErrors(
	errors: FormikErrors<MDFClaim>,
	activityIndex: number
) {
	const activityErrors = errors.activities?.[activityIndex] as FormikErrors<
		MDFClaimActivity
	>;

	return activityErrors?.budgets as FormikErrors<
		MDFClaimBudget[] | undefined
	>;
}
