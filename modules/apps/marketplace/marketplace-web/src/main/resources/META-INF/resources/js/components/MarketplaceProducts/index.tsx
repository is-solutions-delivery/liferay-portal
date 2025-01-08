/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import React from 'react';

import {useMarketplaceProducts} from '../../hooks/useMarketplaceProducts';
import {Product} from '../../types';
import {ManagementToolbar} from '../ManagementToolbar';
import {ProductCard} from './ProductCard';

import '../../styles/products.scss';

type MarketplaceProductsProps = {
	loading: ReturnType<typeof useMarketplaceProducts>['loading'];
	onClickProduct: (product: Product) => void;
	pagination: ReturnType<typeof useMarketplaceProducts>['pagination'];
	products?: Product[];
	searchQuery: any;
	setSearchQuery: any;
	sort: ReturnType<typeof useMarketplaceProducts>['sort'];
};

const filterItems = [
	{label: 'Filter Action 1', onClick: () => alert('Filter clicked')},
	{label: 'Filter Action 2', onClick: () => alert('Filter clicked')},
];

const Products: React.FC<
	Pick<MarketplaceProductsProps, 'loading' | 'onClickProduct' | 'products'>
> = ({loading, onClickProduct, products}) => {
	if (loading) {
		return (
			<div className="align-items-center d-flex justify-content-center payment-methods-modal-body-empty-state pt-4">
				<ClayLoadingIndicator
					displayType="primary"
					shape="squares"
					size="md"
				/>
			</div>
		);
	}

	if (!products?.length) {
		return (
			<ClayEmptyState
				description={Liferay.Language.get('oops')}
				imgSrc="/o/admin-theme/images/states/search_state.svg"
				imgSrcReducedMotion="/o/admin-theme/images/states/search_state.svg"
				title={Liferay.Language.get('no-results-were-found')}
			/>
		);
	}

	return (
		<div className="d-flex flex-wrap p-4 payment-method-app-search-results">
			{products.map((product, index) => (
				<ProductCard
					key={index}
					onClick={onClickProduct}
					product={product}
				/>
			))}
		</div>
	);
};

const MarketplaceProducts: React.FC<MarketplaceProductsProps> = ({
	loading,
	onClickProduct,
	pagination,
	products,
	searchQuery,
	setSearchQuery,
	sort,
}) => (
	<div className="d-flex flex-column h-100 justify-content-between payment-methods-modal-body">
		<ManagementToolbar
			filterItems={filterItems}
			search={searchQuery}
			setSearch={setSearchQuery}
			setSortDirection={sort.setSortDirection}
			sortDirection={sort.sortDirection}
		/>

		<Products
			loading={loading}
			onClickProduct={onClickProduct}
			products={products}
		/>

		<div className="d-flex justify-content-end px-4 py-4 w-100">
			<ClayPaginationBarWithBasicItems
				activeDelta={pagination.pageSize}
				className="w-100"
				defaultActive={pagination.page}
				deltas={pagination.pageSizeDeltas}
				ellipsisBuffer={1}
				ellipsisProps={{
					'aria-label': Liferay.Language.get('more'),
					'title': Liferay.Language.get('more'),
				}}
				onActiveChange={pagination.setPage}
				onDeltaChange={pagination.setPageSize}
				totalItems={pagination.totalCount}
			/>
		</div>
	</div>
);

export {MarketplaceProducts};
