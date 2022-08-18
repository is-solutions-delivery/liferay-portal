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

import Table from './components/Table';
import mdfListColumn from './components/mdfListColumn';
import ClayButton from '@clayui/button';
import MDFRequest from '../../../../common/interfaces/mdfRequest';
import MDFRequestStepProps from '../../interfaces/mdfRequestStepProps';

const MDFList= ({
}:MDFRequestStepProps<MDFRequest>) => {

	const {data} = useGetMDFRequest();

	const mdfListObject = data?.items.reduce(
		(objAccumulator: any, values: any) => {

			const obj = {
				activityPeriod: values.minDateActivity + values.maxDateActivity,
				approved: '',
				reimpursementClaim: '',
				requestId: values.id,
				requested: '',
				status: values.status.label_i18n,
				totalCost: '',
		};

			return {
 
				items: [...objAccumulator.items, obj],

			};
		},
		{items: []}
	);


	return (
		<div className="border-0 pb-3 pt-5 px-6 sheet">
			<h1>MDF Requests</h1>

			<div className="bg-neutral-1 rounded p-3">
				<ClayButton className="mr-1" displayType="secondary">
					Export MDF Report
				</ClayButton>
				<ClayButton
				>
					New Request
				</ClayButton>
			</div>
			<div className="mt-3">
				<Table
					borderless
					columns={mdfListColumn}
					responsive
					rows={mdfListObject?.items}
				></Table>
			</div>

		</div>
	);
};
export default MDFList;