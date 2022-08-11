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

import Pagination from './components/Pagination';
import Table from './components/Table';
import columns from './components/columns';

const MdfList: any = ({setStep}: {setStep: any}) => {
	return (
		<div className="borderless m-5">
			<h1>MDF Requests</h1>

			<div className="mt-4">
				<Table
					columns={columns}
					responsive={true}
					rows={mockRows}
				></Table>
			</div>

			<Pagination></Pagination>
		</div>
	);
};
export default MdfList;

const mockRows = [
	{
		activityPeriod: new Date().toString(),
		approved: '$40,000',
		reimpursementClaim: 'Claim-193392: Claim Paid',
		requestId: 123,
		requested: '$40,000',
		status: 'Approved',
		totalCost: '$80,000',
	},
	{
		activityPeriod: new Date().toString(),
		approved: '$40,000',
		reimpursementClaim: 'Claim-193392: Claim Paid',
		requestId: 123,
		requested: '$40,000',
		status: 'Rejected',
		totalCost: '$80,000000',
	},
	{
		activityPeriod: new Date().toString(),
		approved: '$40,000',
		reimpursementClaim: 'Claim-193392: Claim Paid',
		requestId: 123,
		requested: '$40,000',
		status: 'Approved',
		totalCost: '$80,000',
	},
	{
		activityPeriod: new Date().toString(),
		approved: '$40,000',
		reimpursementClaim: 'Claim-193392: Claim Paid',
		requestId: 123,
		requested: '$40,000',
		status: 'Approved',
		totalCost: '$80,000',
	},
];
