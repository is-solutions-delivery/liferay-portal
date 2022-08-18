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
import useGetMDFRequest from '../../../../common/services/liferay/object/mdf-requests/useGetMDFRequest';
import getMDFListObject from './hooks/mdfListObject';
import { useMemo } from 'react';

const MDFList= ({
}:MDFRequestStepProps<MDFRequest>) => {

	const {data} = useGetMDFRequest();
	console.log(data)
	const mdfListObject = useMemo(() => getMDFListObject(data?.items), data?.items) 
	console.log(mdfListObject)

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
					rows={mdfListObject}
				></Table>
			</div>

		</div>
	);
};
export default MDFList;