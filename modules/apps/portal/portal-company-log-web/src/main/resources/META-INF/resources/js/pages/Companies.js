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

import ClayLabel from '@clayui/label';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import ClayTable from '@clayui/table';
import React, {useState} from 'react';

import Header from '../components/layout/Header';
import Page from '../components/layout/Page';
import useCompanies from '../hooks/useCompanies';

const deltas = [
	{
		label: 4,
	},
	{
		label: 8,
	},
	{
		label: 16,
	},
	{
		label: 32,
	},
];

const CompanyLogs = ({
	history,
	items = [],
	page,
	pageSize,
	totalCount = 0,
	setPagination,
}) => (
	<div className="mt-4">
		<ClayTable>
			<ClayTable.Head>
				<ClayTable.Row>
					<ClayTable.Cell expanded headingCell>
						{Liferay.Language.get('instance-id')}
					</ClayTable.Cell>

					<ClayTable.Cell headingCell>
						{Liferay.Language.get('web-id')}
					</ClayTable.Cell>

					<ClayTable.Cell expanded headingCell>
						{Liferay.Language.get('company')}
					</ClayTable.Cell>
				</ClayTable.Row>
			</ClayTable.Head>

			<ClayTable.Body>
				{items.map(({id, name, webId}, index) => (
					<ClayTable.Row
						className="cursor-pointer"
						key={index}
						onClick={() => history.push(`/${id}`)}
					>
						<ClayTable.Cell headingTitle>{id}</ClayTable.Cell>

						<ClayTable.Cell headingTitle>{webId}</ClayTable.Cell>

						<ClayTable.Cell headingTitle>
							<span className="align-items-baseline d-flex">
								{name}

								{Liferay.ThemeDisplay.getCompanyId() ===
									String(id) && (
									<ClayLabel
										className="ml-2"
										displayType="info"
									>
										{Liferay.Language.get('current')}
									</ClayLabel>
								)}
							</span>
						</ClayTable.Cell>
					</ClayTable.Row>
				))}
			</ClayTable.Body>
		</ClayTable>

		<ClayPaginationBarWithBasicItems
			acive={page}
			activeDelta={pageSize}
			deltas={deltas}
			ellipsisBuffer={3}
			ellipsisProps={{'aria-label': 'More', 'title': 'More'}}
			onActiveChange={(page) => {
				setPagination((prevPagination) => ({
					...prevPagination,
					page,
				}));
			}}
			onDeltaChange={(pageSize) =>
				setPagination((prevPagination) => ({
					...prevPagination,
					pageSize,
				}))
			}
			totalItems={totalCount}
		/>
	</div>
);

const Companies = ({history}) => {
	const [pagination, setPagination] = useState({page: 1, pageSize: 5});
	const {items, loading, totalCount} = useCompanies(pagination);

	return (
		<section>
			<Header
				breadcrumbItems={[{label: Liferay.Language.get('home')}]}
				title={Liferay.Language.get('virtual-instance-server-logs')}
			/>

			<Page loading={loading}>
				<CompanyLogs
					{...pagination}
					history={history}
					items={items}
					setPagination={setPagination}
					totalCount={totalCount}
				/>
			</Page>
		</section>
	);
};

export default Companies;
