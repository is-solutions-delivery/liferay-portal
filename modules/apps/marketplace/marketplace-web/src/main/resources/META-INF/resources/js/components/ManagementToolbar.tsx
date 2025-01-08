/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayManagementToolbar from '@clayui/management-toolbar';
import React, {useState} from 'react';

type Sort = 'asc' | 'desc';

type ManagementToolbarProps = {
	filterItems: any[];
	search: string;
	setSearch: React.Dispatch<string>;
	setSortDirection: React.Dispatch<Sort>;
	sortDirection: Sort;
};

const SORT_ICON = {
	asc: 'order-list-up',
	desc: 'order-list-down',
};

export function ManagementToolbar({
	filterItems,
	search,
	setSearch,
	setSortDirection,
	sortDirection,
}: ManagementToolbarProps) {
	const [searchMobile, setSearchMobile] = useState(false);

	return (
		<ClayManagementToolbar className="w-100">
			<ClayManagementToolbar.ItemList>
				<ClayDropDownWithItems
					items={filterItems}
					trigger={
						<ClayButton className="nav-link" displayType="unstyled">
							<span className="navbar-breakpoint-down-d-none">
								<span className="navbar-text-truncate">
									{Liferay.Language.get('filter-and-order')}
								</span>

								<ClayIcon
									className="inline-item inline-item-after"
									symbol="caret-bottom"
								/>
							</span>

							<span className="navbar-breakpoint-d-none">
								<ClayIcon symbol="filter" />
							</span>
						</ClayButton>
					}
				/>

				<ClayManagementToolbar.Item>
					<ClayButton
						aria-label="Order"
						className="nav-link nav-link-monospaced"
						displayType="unstyled"
						onClick={() =>
							setSortDirection(
								sortDirection === 'asc' ? 'desc' : 'asc'
							)
						}
					>
						<ClayIcon symbol={SORT_ICON[sortDirection]} />
					</ClayButton>
				</ClayManagementToolbar.Item>
			</ClayManagementToolbar.ItemList>

			<ClayManagementToolbar.Search showMobile={searchMobile}>
				<ClayInput.Group>
					<ClayInput.GroupItem>
						<ClayInput
							aria-label="Search"
							className="form-control input-group-inset input-group-inset-after"
							defaultValue="Search"
							onChange={(event) => setSearch(event.target.value)}
							type="text"
							value={search}
						/>

						<ClayInput.GroupInsetItem after tag="span">
							<ClayButtonWithIcon
								aria-label="Close search"
								className="navbar-breakpoint-d-none"
								displayType="unstyled"
								onClick={() => setSearchMobile(false)}
								symbol="times"
							/>

							<ClayButtonWithIcon
								aria-label="Search"
								displayType="unstyled"
								symbol="search"
								type="submit"
							/>
						</ClayInput.GroupInsetItem>
					</ClayInput.GroupItem>
				</ClayInput.Group>
			</ClayManagementToolbar.Search>

			<ClayManagementToolbar.ItemList>
				<ClayManagementToolbar.Item className="navbar-breakpoint-d-none">
					<ClayButton
						aria-label="Search"
						className="nav-link nav-link-monospaced"
						displayType="unstyled"
						onClick={() => setSearchMobile(true)}
					>
						<ClayIcon symbol="search" />
					</ClayButton>
				</ClayManagementToolbar.Item>
			</ClayManagementToolbar.ItemList>
		</ClayManagementToolbar>
	);
}
