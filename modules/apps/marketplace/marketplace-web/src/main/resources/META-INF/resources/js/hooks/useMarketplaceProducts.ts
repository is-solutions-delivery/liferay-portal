/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useDebounce} from '@clayui/shared';
import {fetch} from 'frontend-js-web';
import {useCallback, useEffect, useState} from 'react';

import {APIResponse, Product} from '../types';
import {useMarketplaceAuthorization} from './useMarketplaceAuthorization';

type Sort = 'asc' | 'desc';

const pageSizeDeltas = [
	{
		label: 8,
	},
	{
		label: 16,
	},
	{
		label: 24,
	},
	{
		label: 32,
	},
];

const SORT_ICON = {
	asc: 'order-list-up',
	desc: 'order-list-down',
};

const useMarketplaceProducts = (
	authorization: NonNullable<
		ReturnType<typeof useMarketplaceAuthorization>['data']
	>
) => {
	const {
		settings: {channelId, references = {paymentMethodFilter: ''}} = {},
		url,
	} = authorization || {};

	const [pageSize, setPageSize] = useState(8);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [sortDirection, setSortDirection] = useState<Sort>('desc');
	const [productsResponse, setProductsResponse] =
		useState<APIResponse<Product>>();

	const [searchQuery, setSearchQuery] = useState('');
	const debouncedValue = useDebounce(searchQuery, 1000);

	const fetchProducts = useCallback(async (): Promise<
		APIResponse<Product> | undefined | void
	> => {
		const urlSearchParams = new URLSearchParams({
			accountId: '-1',
			filter: references?.paymentMethodFilter,
			images: 'accountId=-1',
			nestedFields: 'productSpecifications,skus,categories,images',
			page: String(page),
			pageSize: String(pageSize),
			search: debouncedValue,
			skus: 'accountId=-1',
			sort: `name:${sortDirection}`,
		});

		const response = await fetch(
			`${url}/o/headless-commerce-delivery-catalog/v1.0/channels/${channelId}/products?${urlSearchParams.toString()}`
		);

		const data = await response.json();

		setProductsResponse(data);
	}, [
		channelId,
		debouncedValue,
		page,
		pageSize,
		references?.paymentMethodFilter,
		sortDirection,
		url,
	]);

	useEffect(() => {
		setLoading(true);

		fetchProducts()
			.catch((error) => console.error('Failed to fetch products:', error))
			.finally(() => setLoading(false));
	}, [fetchProducts]);

	return {
		loading,
		pagination: {
			page,
			pageSize,
			pageSizeDeltas,
			setPage,
			setPageSize,
			totalCount: productsResponse?.totalCount || 0,
		},
		productsResponse,
		search: {
			searchQuery,
			setSearchQuery,
		},
		sort: {
			SORT_ICON,
			setSortDirection,
			sortDirection,
		},
	};
};

export {useMarketplaceProducts};
