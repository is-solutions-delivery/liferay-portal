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

import PRMFormik from '../../../../common/components/PRMFormik';
import MDFClaim from '../../../../common/interfaces/mdfClaim';
import MDFClaimForm from '../../MDFClaimForm';
import claimSchema from '../../schema/yup';
import submitForm from '../../utils/submitForm';

const initialMDFClaimFormValues: MDFClaim = {
	mdfClaimActivities: [],
	mdfClaimDocuments: {
		claims: [],
		budgets: [],
		activities: [],
	},
	totalClaimAmount: 0,
};

const MDFClaimFormik = () => {
	return (
		<PRMFormik
			initialValues={initialMDFClaimFormValues}
			onSubmit={submitForm}
		>
			<MDFClaimForm
				onSaveAsDraft={submitForm}
				validationSchema={claimSchema}
			/>
		</PRMFormik>
	);
};

export default MDFClaimFormik;
