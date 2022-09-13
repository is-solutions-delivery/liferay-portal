/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {useEffect, useState} from 'react';

import Container from '../../../components/Layout/Container';
import ListView, {ListViewProps} from '../../../components/ListView';
import {TableProps} from '../../../components/Table';
import i18n from '../../../i18n';
import fetcher from '../../../services/fetcher';
import {Actions} from '../../../types';
import {getUniqueList} from '../../../util';
import {searchUtil} from '../../../util/search';

type UserGroupsListViewProps = {
	actions?: Actions;
	projectId?: number | string;
	state?: any;
	variables?: any;
} & {listViewProps?: Partial<ListViewProps>; tableProps?: Partial<TableProps>};

const UserGroupsListView: React.FC<UserGroupsListViewProps> = ({
	listViewProps,
	tableProps,
	variables,
}) => {
	return (
		<ListView
			managementToolbarProps={{}}
			resource="/user-groups"
			tableProps={{
				columns: [
					{
						clickable: true,
						key: 'name',
						value: 'name',
					},

					{
						clickable: true,
						key: 'description',
						value: i18n.translate('team'),
					},
					{
						clickable: true,
						key: 'usersCount',
						value: i18n.translate('team'),
					},
				],
				rowSelectable: true,
				...tableProps,
			}}
			transformData={(data: any) => data}
			variables={variables}
			{...listViewProps}
		/>
	);
};

type UserGroupProps = {
	setState: any;
};

const UserGroups: React.FC<UserGroupProps> = ({setState}) => {
	const [value, setValue] = useState<any>([]);

	useEffect(() => {
		if (value?.length) {
			fetcher(
				`/user-accounts?field=id&filter=${searchUtil.in(
					'userGroupIds',
					value
				)}`
			).then((response) => {
				const userId = response?.items?.map(({id}: any) => id);

				setState((state: any) => getUniqueList([...state, ...userId]));
			});
		}
	}, [setState, value]);

	return (
		<Container>
			<UserGroupsListView
				listViewProps={{
					onContextChange: ({selectedRows}) => {
						setValue(selectedRows);
					},
				}}
			/>
		</Container>
	);
};

export {UserGroupsListView, UserGroups};

export default UserGroups;
