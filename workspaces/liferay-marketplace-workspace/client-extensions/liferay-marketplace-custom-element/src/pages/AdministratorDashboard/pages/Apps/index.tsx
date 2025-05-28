/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useSearchParams} from 'react-router-dom';

import {
	AppActions,
	ListViewTypes,
} from '../../../../components/ListView/hooks/ListViewContext';
import Page from '../../../../components/Page';
import {ProductType, ProductTypeLabels} from '../../../../enums/Product';
import useListTypeDefinition from '../../../../hooks/useListTypeDefinition';
import i18n from '../../../../i18n';
import {LIFERAY_VERSION_PICKLIST} from '../../../PublisherDashboard/pages/NewAppFlow/constants';
import InfoCard from '../../components/InfoCard';
import useAppsMetrics from '../../hooks/useAppsMetrics';
import {percentage} from '../../util';
import AdministratorAppsListView from './AdministratorAppsListView';

type FilterItem = {
	children: {
		name: string;
		onClick: (dispatch: React.Dispatch<AppActions>) => void;
	}[];
	name: string;
};

function createFilterGroup<T extends string | number>(
	values: T[] | Record<string, T>,
	label: string
): FilterItem {
	const isAppType = !Array.isArray(values);

	const items = Array.isArray(values)
		? values
		: Object.keys(values).map((key) => values[key]);

	return {
		children: items.map((item) => ({
			name: isAppType
				? ProductTypeLabels[item as keyof typeof ProductTypeLabels]
				: String(item),
			onClick: (dispatch: React.Dispatch<AppActions>) =>
				dispatch({
					payload: {
						filters: {
							filter: {
								specificationValues: item,
							},
						},
					},
					type: ListViewTypes.SET_FILTERS,
				}),
		})),
		name: i18n.translate(label as any),
	};
}

export default function Apps() {
	const {data} = useListTypeDefinition(LIFERAY_VERSION_PICKLIST);
	const [searchParams] = useSearchParams();

	const pageFilter = searchParams.get('filter') || '';

	const LiferayVersions =
		data?.listTypeEntries?.map((version) => version.name).reverse() ?? [];

	const filterItems = [
		{
			label: 'app-type',
			value: ProductType,
		},
		{
			label: 'liferay-version',
			value: LiferayVersions,
		},
	].map(({label, value}) => createFilterGroup(value, label));

	const {
		approved,
		approvedBeforeLastWeek,
		approvedLastWeek,
		inReview,
		inreviewBeforeLastWeek,
		inreviewLastlastweek,
		products,
	} = useAppsMetrics('week');

	return (
		<>
			<div className="d-flex flex-wrap mb-3">
				<InfoCard
					className="mr-3"
					expanded
					growth={percentage(
						products,
						inreviewLastlastweek - inreviewBeforeLastWeek
					)}
					growthContext={`+${inreviewLastlastweek - inreviewBeforeLastWeek} this week`}
					symbol="squares-clock"
					title="App Awaiting Review"
					value={inReview}
				/>

				<InfoCard
					expanded
					growth={percentage(
						products,
						approvedLastWeek - approvedBeforeLastWeek
					)}
					growthContext={`+${approvedLastWeek - approvedBeforeLastWeek} this week`}
					symbol="squares"
					title="Recently Published"
					value={approved}
				/>
			</div>

			<Page
				pageRendererProps={{className: 'border py-2 rounded-lg'}}
				title="Apps"
			>
				<AdministratorAppsListView
					filter={pageFilter as string}
					listViewProps={{
						managementToolbarProps: {
							filterItems,
							visible: true,
						},
						paginationOptions: {displayType: 'always'},
					}}
				/>
			</Page>
		</>
	);
}
