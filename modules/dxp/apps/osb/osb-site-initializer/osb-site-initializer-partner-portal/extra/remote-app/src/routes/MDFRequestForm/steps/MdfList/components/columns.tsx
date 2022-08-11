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

import ClayIcon from '@clayui/icon';

import DropDown from './Drop-Down';

const columns = [
	{label: 'Request ID', columnKey: 'requestId'},
	{
		label: 'Status',
		columnKey: 'status',
		render: (status: string) => (
			<div className="align-items-center">
				<ClayIcon symbol="simple-circle" />

				{status}
			</div>
		),
	},
	{label: 'Activity Period', columnKey: 'activityPeriod'},
	{label: 'Total Cost', columnKey: 'totalCost'},
	{label: 'Requested', columnKey: 'requested'},
	{label: 'Approved', columnKey: 'approved'},

	{
		label: 'Reimpursement Claim(s)',
		columnKey: 'reimpursementClaim',
	},
	{
		label: '',
		columnKey: '',
		render: () => (
			<div>
				<ClayIcon symbol="comments" />
			</div>
		),
	},
	{
		label: '',
		columnKey: '',
		render: () => (
			<div>
				<DropDown
					optionList={[
						{
							icon: 'check',
							label: 'Approve',
							optionKey: 'approve',
						},
						{
							icon: 'times',
							label: 'Reject',
							optionKey: 'reject',
						},
					]}
				></DropDown>
			</div>
		),
	},
];

export default columns;
