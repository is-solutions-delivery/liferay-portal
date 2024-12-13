/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useDebounce} from '@clayui/shared';
import {useCallback, useEffect, useState} from 'react';

import {APIResponse, Channel, Product} from '../types';

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

const API_BASE_URL = 'https://marketplace-uat.liferay.com';
const CHANNEL_NAME = 'Marketplace Channel';
const CATEGORY_ID = '34083689';

const useProducts = () => {
	const [delta, setDelta] = useState(8);
	const [deltas, setDeltas] = useState(1);
	const [loading, setLoading] = useState(false);
	const [sortDirection, setSortDirection] = useState<Sort>('desc');
	const [channelId, setChannelId] = useState<Number>();
	const [productsResponse, setProductsResponse] =
		useState<APIResponse<Product>>();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const deboucedValue = useDebounce(searchQuery, 1000);

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

	const fetchChannelId = useCallback(
		async (
			options?: RequestInit
		): Promise<APIResponse<Channel> | undefined | void> => {
			try {
				const url = buildUrl(
					`${API_BASE_URL}/o/headless-commerce-delivery-catalog/v1.0/channels`,
					{
						search: `name eq '${CHANNEL_NAME}'`,
					}
				);

				const response = await Liferay.Util.fetch(url.toString(), {
					headers: {
						...options?.headers,
						'Content-Type': 'application/json',
					},
				});

				const data = await response.json();

				if (data?.items?.length) {
					return data;
				}
			}
			catch (error) {
				console.error('Failed to fetch channel ID:', error);
			}
		},
		[]
	);

	const fetchProducts = useCallback(
		async (
			options?: RequestInit
		): Promise<APIResponse<Product> | undefined | void> => {
			if (!channelId) {
				const getChannelResponse = await fetchChannelId();

				setChannelId(getChannelResponse?.items[0]?.id);

				return;
			}

			try {
				const url = buildUrl(
					`${API_BASE_URL}/o/headless-commerce-delivery-catalog/v1.0/channels/${channelId}/products`,
					{
						accountId: -1,
						filter: `(categoryIds/any(x:(x eq '${CATEGORY_ID}')))`,
						images: 'accountId=-1',
						nestedFields:
							'productSpecifications,skus,categories,images',
						page: deltas,
						pageSize: delta,
						search: deboucedValue,
						skus: 'accountId=-1',
						sort: `name:${sortDirection}`,
					}
				);

				const response = await Liferay.Util.fetch(url.toString(), {
					headers: {
						...options?.headers,
						'Content-Type': 'application/json',
					},
				});

				const data = await response.json();

				setProductsResponse(data);
			}
			catch (error) {
				console.error('Failed to fetch products:', error);
			}
		},
		[channelId, deboucedValue, delta, deltas, fetchChannelId, sortDirection]
	);

	useEffect(() => {
		(async () => {
			setLoading(true);
			await fetchProducts();
			setLoading(false);
		})();
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
