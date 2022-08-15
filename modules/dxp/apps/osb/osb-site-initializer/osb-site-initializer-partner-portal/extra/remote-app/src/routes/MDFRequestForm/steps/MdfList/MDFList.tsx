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
import MDFListColumn from './components/MDFListColumn';
import Button from '@clayui/button';
import MDFRequest from '../../../../common/interfaces/mdfRequest';
import MDFRequestStepProps from '../../interfaces/mdfRequestStepProps';

const MdfList: any = ({
	onNewRequest
}:MDFRequestStepProps<MDFRequest>) => {
	return (
		<div className="border-0 pb-3 pt-5 px-6 sheet">
			<h1>MDF Requests</h1>
			<div className='bg-neutral-1 rounded p-3'>
				<Button className='mr-1' displayType={"secondary"}>
					Export MDF Report
				</Button>
				<Button
					onClick={onNewRequest}
				>
					New Request
				</Button>
			</div>
			<div className="mt-3">
				<Table
					borderless = {true}
					columns={MDFListColumn}
					responsive={true}
					rows={}
				></Table>
			</div>

		</div>
	);
};
export default MdfList;