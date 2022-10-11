/* eslint-disable no-console */
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

import ClayLoadingIndicator from '@clayui/loading-indicator';

import PRMFormik from '../../common/components/PRMFormik';
import MDFRequestActivityDTO from '../../common/interfaces/dto/mdfRequestActivityDTO';
import MDFClaim from '../../common/interfaces/mdfClaim';
import useGetMDFRequestById from '../../common/services/liferay/object/mdf-requests/useGetMDFRequestById';
import MDFClaimPage from './components/MDFClaimPage';
import submitForm from './utils/submitForm';
import useLiferayNavigate from '../../common/hooks/useLiferayNavigate';
import {Liferay} from '../../common/services/liferay';
import {PRMPageRoute} from '../../common/enums/prmPageRoute';

const getInitialFormValues = (
	totalrequestedAmount?: number,
	activitiesDTO?: MDFRequestActivityDTO[]
): MDFClaim => ({
	activities: activitiesDTO?.map((activity) => ({
		budgets: activity.activityToBudgets?.map((budget) => ({
			id: budget.id,
			claimAmount: budget.cost,
			expenseName: budget.expense.name,
		})),
		id: activity.id,
		metrics: '',
		name: activity.name,
		selected: false,
		totalCost: 0,
	})),
	totalClaimAmount: 0,
	totalrequestedAmount,
	r_mdfRequestToMdfClaims_c_mdfRequestId: 45281,
});

const MDFClaimForm = () => {
	const siteURL = useLiferayNavigate();

	const onCancel = () =>
		Liferay.Util.navigate(`${siteURL}/${PRMPageRoute.MDF_CLAIM_LISTING}`);

	const {data: mdfRequest, isValidating} = useGetMDFRequestById(45281);

	if (!mdfRequest || isValidating) {
		return <ClayLoadingIndicator />;
	}

	return (
		<PRMFormik
			initialValues={getInitialFormValues(
				mdfRequest.totalMDFRequestAmount,
				mdfRequest.mdfRequestToActivities
			)}
			onSubmit={(values, formikHelpers) =>
				submitForm(values, formikHelpers, siteURL)
			}
		>
			<MDFClaimPage
				mdfRequest={mdfRequest}
				onCancel={onCancel}
				onSaveAsDraft={(values, formikHelpers) =>
					submitForm(values, formikHelpers, siteURL)
				}
			/>
		</PRMFormik>
	);
};

export default MDFClaimForm;
