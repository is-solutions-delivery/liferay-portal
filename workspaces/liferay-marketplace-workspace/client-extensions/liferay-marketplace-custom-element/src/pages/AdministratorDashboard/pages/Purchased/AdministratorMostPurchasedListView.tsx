/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ListView, {ListViewProps} from '../../../../components/ListView';
import {ManagementToolbarProps} from '../../../../components/ListView/components/ManagementToolbar';
import i18n from '../../../../i18n';
import {safeJSONParse} from '../../../../utils/util';

type PurchasedItem = {
	productName: string;
	purchaseCount: number;
	thumbnail: string;
};

type PurchasedItemsKey = 'MostPurchasedApps' | 'MostPurchasedLiferayProducts';

type PurchasedReportValue = {
	MostPurchasedApps?: PurchasedItem[];
	MostPurchasedLiferayProducts?: PurchasedItem[];
};

type ReportsEntry = {
	value?: string;
};

type AdministratorMostPurchasedListViewProps = {
	itemsKey: PurchasedItemsKey;
	listViewProps?: Partial<ListViewProps<PurchasedItem>>;
	managementToolbarProps?: {
		visible?: boolean;
	} & Omit<
		ManagementToolbarProps,
		| 'actions'
		| 'onSelectAllRows'
		| 'rowSelectable'
		| 'tableProps'
		| 'totalItems'
	>;
};

const REPORTS_ENDPOINT = 'o/c/reports';
const REPORTS_FILTER = "externalReferenceCode eq 'PURCHASED-PRODUCTS-COUNT'";

function normalizePurchasedItems(items: PurchasedItem[]) {
	return items
		.map(({productName = '', purchaseCount = 0, thumbnail = ''}) => ({
			productName,
			purchaseCount,
			thumbnail,
		}))
		.sort((a, b) => {
			if (b.purchaseCount !== a.purchaseCount) {
				return b.purchaseCount - a.purchaseCount;
			}

			return a.productName.localeCompare(b.productName);
		})
		.slice(0, 5);
}

const AdministratorMostPurchasedListView: React.FC<
	AdministratorMostPurchasedListViewProps
> = ({itemsKey, listViewProps, managementToolbarProps}) => (
	<ListView<PurchasedItem>
		emptyStateProps={{title: i18n.translate('no-results-found')}}
		id="administrator-most-purchased"
		managementToolbarProps={{
			...managementToolbarProps,
			visible: false,
		}}
		resource={`${REPORTS_ENDPOINT}?filter=${encodeURIComponent(REPORTS_FILTER)}`}
		tableProps={{
			columns: [
				{
					id: 'productName',
					name: i18n.translate('name'),
					render: (productName, {thumbnail}) => (
						<div className="align-items-center d-flex">
							<img
								alt={productName}
								className="app-details-page-table-icon"
								src={thumbnail}
							/>

							<span className="font-weight-semi-bold ml-3 text-nowrap">
								{productName}
							</span>
						</div>
					),
				},
				{
					id: 'purchaseCount',
					name: i18n.translate('number-of-purchases'),
				},
			],
		}}
		transformData={(response) => {
			const reportsResponse =
				response as unknown as APIResponse<ReportsEntry>;

			const reportValue = safeJSONParse<PurchasedReportValue>(
				reportsResponse.items[0]?.value || '',
				{
					MostPurchasedApps: [],
					MostPurchasedLiferayProducts: [],
				}
			);

			const items = normalizePurchasedItems(reportValue[itemsKey] || []);

			return {
				...response,
				items,
				totalCount: items.length,
			} as APIResponse<PurchasedItem>;
		}}
		{...listViewProps}
	/>
);

export default AdministratorMostPurchasedListView;
