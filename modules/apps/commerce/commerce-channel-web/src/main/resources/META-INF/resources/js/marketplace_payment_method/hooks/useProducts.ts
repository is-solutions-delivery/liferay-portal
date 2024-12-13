/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useDebounce} from '@clayui/shared';
import {useCallback, useEffect, useState} from 'react';

import {APIResponse, Product} from '../types';
import {useMarketplaceAuthorization} from './useMarketplaceAuthorization';

type Sort = 'asc' | 'desc';

const pageSize = [
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

const CATEGORY_ID = '34083689';

const useProducts = (
	authorization: NonNullable<
		ReturnType<typeof useMarketplaceAuthorization>['data']
	>
) => {
	const {
		instance: {channelId},
		url,
	} = authorization || {};

	const [delta, setDelta] = useState(8);
	const [deltas, setDeltas] = useState(1);
	const [loading, setLoading] = useState(false);
	const [sortDirection, setSortDirection] = useState<Sort>('desc');
	const [productsResponse, setProductsResponse] =
		useState<APIResponse<Product>>();

	const [searchQuery, setSearchQuery] = useState('');
	const debouncedValue = useDebounce(searchQuery, 1000);

	const buildUrl = (
		basePath: string,
		params: Record<string, string | number | undefined>
	) => {
		const url = new URL(basePath);

		for (const key in params) {
			if (params[key] !== undefined) {
				url.searchParams.append(key, String(params[key]));
			}
		}

		return url.toString();
	};

	const fetchProducts = useCallback(async (): Promise<
		APIResponse<Product> | undefined | void
	> => {
		const _url = buildUrl(
			`${url}/o/headless-commerce-delivery-catalog/v1.0/channels/${channelId}/products`,
			{
				accountId: -1,
				filter: `(categoryIds/any(x:(x eq '${CATEGORY_ID}')))`,
				images: 'accountId=-1',
				nestedFields: 'productSpecifications,skus,categories,images',
				page: deltas,
				pageSize: delta,
				search: debouncedValue,
				skus: 'accountId=-1',
				sort: `name:${sortDirection}`,
			}
		);

		const response = await Liferay.Util.fetch(_url.toString());

		const data = await response.json();

		setProductsResponse(data);
	}, [url, channelId, debouncedValue, delta, deltas, sortDirection]);

	useEffect(() => {
		fetchProducts()
			.catch((error) => console.error('Failed to fetch products:', error))
			.finally(() => setLoading(false));
	}, [fetchProducts]);

	return {
		loading,
		pagination: {
			delta,
			deltas,
			pageSize,
			setDelta,
			setDeltas,
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

export default useProducts;
