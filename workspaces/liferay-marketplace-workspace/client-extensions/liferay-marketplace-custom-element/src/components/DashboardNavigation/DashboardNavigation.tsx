/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';

import {getAccountImage} from '../../utils/util';
import {DashboardNavigationList} from './DashboardNavigationList';

import './DashboardNavigation.scss';
import {Liferay} from '../../liferay/liferay';
import CommerceSelectAccountImpl from '../../services/rest/CommerceSelectAccount';
import {AppProps} from '../DashboardTable/DashboardTable';

export type DashboardListItems = {
	itemIcon: string;
	itemName: string;
	itemSelected?: boolean;
	itemTitle: string;
	items?: AppProps[];
	path: string;
};

type DashboardNavigationProps = {
	accountAppsNumber: number;
	accountIcon: string;
	accounts: Account[];
	currentAccount: Account;
	dashboardNavigationItems: DashboardListItems[];
};

export function DashboardNavigation({
	accountAppsNumber,
	accountIcon,
	accounts,
	currentAccount,
	dashboardNavigationItems,
}: DashboardNavigationProps) {
	return (
		<div className="dashboard-navigation-container">
			<ClayDropDown
				trigger={
					<div className="dashboard-navigation-header">
						<div className="dashboard-navigation-header-left-content">
							<img
								alt="account logo"
								className="dashboard-navigation-header-logo"
								draggable={false}
								src={getAccountImage(accountIcon)}
							/>

							<div className="dashboard-navigation-header-text-container">
								<span
									className="dashboard-navigation-header-title"
									title={currentAccount?.name}
								>
									{currentAccount?.name}
								</span>

								{!!accountAppsNumber && (
									<span className="dashboard-navigation-header-apps">
										{accountAppsNumber} apps
									</span>
								)}
							</div>
						</div>

						<ClayIcon
							className="dashboard-navigation-header-arrow-down"
							symbol="caret-bottom"
						/>
					</div>
				}
			>
				<ClayDropDown.ItemList>
					{accounts.map((account) => (
						<ClayDropDown.Item
							active={account.id === currentAccount?.id}
							key={account.id}
							onClick={() =>
								CommerceSelectAccountImpl.selectAccount(
									account.id
								).then(() => {
									Liferay.CommerceContext.account = {
										accountId: account.id,
									};

									window.location.reload();
								})
							}
						>
							{account.name}
						</ClayDropDown.Item>
					))}
				</ClayDropDown.ItemList>
			</ClayDropDown>

			<div className="dashboard-navigation-body">
				{dashboardNavigationItems.map((dashboardNavigation, index) => (
					<DashboardNavigationList
						dashboardNavigation={dashboardNavigation}
						key={index}
					/>
				))}
			</div>
		</div>
	);
}
