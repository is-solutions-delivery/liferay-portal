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

import {ClayPaginationWithBasicItems} from '@clayui/pagination';

import {useState} from 'react';

type Props = {
	listObj?: any; // in the future change to an array of the object
};
const Pagination = ({listObj, ...props}: Props) => {
	const [active, setActive] = useState(1);

	return (
		<div {...props}>
			<ClayPaginationWithBasicItems
				active={active}
				ellipsisBuffer={1}
				onActiveChange={setActive}
				totalPages={25}
			/>
		</div>
	);
};
export default Pagination;
