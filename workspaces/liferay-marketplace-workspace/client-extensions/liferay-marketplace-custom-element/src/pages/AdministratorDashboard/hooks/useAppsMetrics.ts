/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {addDays} from 'date-fns';
import useSWR from 'swr';

import SearchBuilder from '../../../core/SearchBuilder';
import {
	ProductTypeVocabulary,
	ProductWorkflowStatusCode,
} from '../../../enums/Product';
import HeadlessCommerceAdminCatalog from '../../../services/rest/HeadlessCommerceAdminCatalog';

type FilterType = 'month' | 'q1' | 'q2' | 'q3' | 'q4' | 'week';

export const METRIC_PARAMETER = {
	month: 30,
	q1: 1,
	q2: 2,
	q3: 3,
	q4: 4,
	week: 7,
};

const searchBuilder = new SearchBuilder().lambda(
	'categoryNames',
	ProductTypeVocabulary.APP
);

const approved = searchBuilder
	.clone()
	.and()
	.lambda('statusCode', ProductWorkflowStatusCode.APPROVED, {unquote: true})
	.build();

const inReview = searchBuilder
	.clone()
	.and()
	.in('statusCode', [
		ProductWorkflowStatusCode.PENDING,
		ProductWorkflowStatusCode.DRAFT,
	])
	.build();

const useAppsMetricks = (param: FilterType = 'week') => {
	const currentTime = new Date();

	const beforeLastPeriod = addDays(
		currentTime,
		-METRIC_PARAMETER[param as keyof typeof METRIC_PARAMETER] * 2
	);

	const lastPeriod = addDays(
		currentTime,
		-METRIC_PARAMETER[param as keyof typeof METRIC_PARAMETER]
	);

	beforeLastPeriod.setHours(0, 0, 0);
	lastPeriod.setHours(23, 59, 59);

	const approvedBeforeLastWeek = searchBuilder
		.clone()
		.and()
		.lambda('statusCode', ProductWorkflowStatusCode.APPROVED)
		.and()
		.lt('createDate', lastPeriod.toISOString())
		.and()
		.gt('createDate', beforeLastPeriod.toISOString())
		.build();

	const approvedLastWeek = searchBuilder
		.clone()
		.and()
		.lambda('statusCode', ProductWorkflowStatusCode.APPROVED, {
			unquote: true,
		})
		.and()
		.gt('createDate', lastPeriod.toISOString())
		.build();

	const inReviewBeforeLastWeek = searchBuilder
		.clone()
		.and()
		.in('statusCode', [
			ProductWorkflowStatusCode.PENDING,
			ProductWorkflowStatusCode.DRAFT,
		])
		.and()
		.lt('createDate', lastPeriod.toISOString())
		.and()
		.gt('createDate', beforeLastPeriod.toISOString())
		.build();

	const inReviewLastWeek = searchBuilder
		.clone()
		.and()
		.in('statusCode', [
			ProductWorkflowStatusCode.PENDING,
			ProductWorkflowStatusCode.DRAFT,
		])
		.and()
		.gt('createDate', lastPeriod.toISOString())
		.build();

	const products = searchBuilder.clone().build();

	const query = {
		approved,
		approvedBeforeLastWeek,
		approvedLastWeek,
		inReview,
		inReviewBeforeLastWeek,
		inReviewLastWeek,
		products,
	};

	const response = useSWR(
		'marketplace/getProductsInfocardKPI',
		async () =>
			await HeadlessCommerceAdminCatalog.getProductsInfocardKPI(query)
	);

	const KPIData = response?.data?.productInfocardKPIResponse;

	return {
		approved: KPIData?.approved?.totalCount || 0,
		approvedBeforeLastWeek:
			KPIData?.approvedBeforeLastWeek?.totalCount || 0,
		approvedLastWeek: KPIData?.approvedLastWeek?.totalCount || 0,
		inReview: KPIData?.inReview?.totalCount || 0,
		inreviewBeforeLastWeek:
			KPIData?.inReviewBeforeLastWeek?.totalCount || 0,
		inreviewLastlastweek: KPIData?.inReviewLastlastweek?.totalCount || 0,
		isError: response.error,
		isLoading: response.isValidating,
		products: KPIData?.products?.totalCount || 0,
	};
};

export default useAppsMetricks;
