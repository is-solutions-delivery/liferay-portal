/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useModal} from '@clayui/modal';
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

import {MarketplaceRest} from './core/MarketplaceRest';
import {useMarketplaceConfiguration} from './hooks/useMarketplaceConfiguration';
import {APIResponse, MarketplaceConfiguration, Product} from './types';

const productSearchParamsDefault = {
	page: 1,
	pageSize: 8,
	search: '',
	sort: 'desc' as 'asc' | 'desc',
};

type State = {
	marketplaceConfiguration: ReturnType<typeof useMarketplaceConfiguration>;
	marketplaceModal: ReturnType<typeof useModal>;
	marketplaceRest: MarketplaceRest;
	productListView: {
		loading: boolean;
		productsResponse?: APIResponse<Product>;
		searchParams: typeof productSearchParamsDefault;
		setProductSearchParams: React.Dispatch<
			typeof productSearchParamsDefault
		>;
	};
};

const defaultState = {
	marketplaceConfiguration: {authorized: false, data: null, loading: true},
} as State;

const MarketplaceContext = createContext<State>(defaultState);

export type MarketplaceContextProviderProps = {
	baseResourceURL: string;
	children: ReactNode;
	settings: {
		productFilter?: 'all' | 'fragments' | 'payments';
		productFilterCustom?: string;
	};
};

function getProductFilter(
	references: MarketplaceConfiguration['settings']['references'],
	settings: MarketplaceContextProviderProps['settings']
) {
	if (settings.productFilterCustom) {
		return settings.productFilterCustom;
	}

	if (settings.productFilter === 'fragments') {
		return references?.fragmentsFilter;
	}

	if (settings.productFilter === 'payments') {
		return references?.paymentMethodFilter;
	}

	return '';
}

export function MarketplaceContextProvider({
	baseResourceURL,
	children,
	settings,
}: MarketplaceContextProviderProps) {
	const marketplaceModal = useModal();

	const [productSearchParams, setProductSearchParams] = useState(
		productSearchParamsDefault
	);

	const [loading, setLoading] = useState(false);

	const [productsResponse, setProductsResponse] =
		useState<APIResponse<Product>>();

	const marketplaceConfiguration =
		useMarketplaceConfiguration(baseResourceURL);

	const marketplaceRest = useMemo(
		() =>
			new MarketplaceRest(
				baseResourceURL,
				marketplaceConfiguration.data as MarketplaceConfiguration
			),
		[baseResourceURL, marketplaceConfiguration.data]
	);

	const authorized = marketplaceConfiguration.authorized;

	useEffect(() => {
		if (!authorized) {
			return;
		}

		setLoading(true);

		const urlSearchParams = new URLSearchParams({
			accountId: '-1',
			filter: getProductFilter(
				marketplaceRest.settings.references,
				settings
			),
			images: 'accountId=-1',
			nestedFields: 'productSpecifications,skus,categories,images',
			page: String(productSearchParams.page),
			pageSize: String(productSearchParams.pageSize),
			search: productSearchParams.search,
			skus: 'accountId=-1',
			sort: `name:${productSearchParams.sort}`,
		});

		marketplaceRest
			.getProducts(urlSearchParams)
			.then(setProductsResponse)
			.catch((error) => console.error('Failed to fetch products:', error))
			.finally(() => setLoading(false));
	}, [
		authorized,
		marketplaceRest,
		productSearchParams.page,
		productSearchParams.pageSize,
		productSearchParams.search,
		productSearchParams.sort,
		settings,
	]);

	return (
		<MarketplaceContext.Provider
			value={{
				...defaultState,
				marketplaceConfiguration,
				marketplaceModal,
				marketplaceRest,
				productListView: {
					loading,
					productsResponse,
					searchParams: productSearchParams,
					setProductSearchParams,
				},
			}}
		>
			{children}
		</MarketplaceContext.Provider>
	);
}

export function useMarketplaceContext() {
	return useContext(MarketplaceContext);
}
