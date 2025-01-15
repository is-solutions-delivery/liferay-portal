/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import React, {ReactElement} from 'react';

import {useMarketplaceContext} from '../../MarketplaceContext';
import {Product} from '../../types';
import {ManagementToolbar} from '../ManagementToolbar';
import {ProductCard} from './ProductCard';

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

type MarketplaceProductsProps = {
	children: (product: Product) => ReactElement;
	onClickProduct: (product: Product) => void;
};

const ProductListView: React.FC<MarketplaceProductsProps> = ({
	onClickProduct,
	...props
}) => {
	const {
		productListView: {
			loading,
			productsResponse,
			searchParams,
			setProductSearchParams,
		},
	} = useMarketplaceContext();

	const products = productsResponse?.items ?? [];

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

	if (!products.length) {
		return (
			<ClayEmptyState
				description={Liferay.Language.get('oops')}
				imgSrc="/o/admin-theme/images/states/search_state.svg"
				title={Liferay.Language.get('no-results-were-found')}
			/>
		);
	}

	return (
		<>
			<div className="d-flex flex-wrap h-100 marketplace-search-results p-4">
				{products.map((product, index) => (
					<ProductCard
						key={index}
						onClick={onClickProduct}
						product={product}
						{...props}
					/>
				))}
			</div>

			<div className="d-flex justify-content-end px-4 py-4 w-100">
				<ClayPaginationBarWithBasicItems
					activeDelta={searchParams.pageSize}
					className="w-100"
					defaultActive={searchParams.page}
					deltas={pageSizeDeltas}
					ellipsisBuffer={1}
					ellipsisProps={{
						'aria-label': Liferay.Language.get('more'),
						'title': Liferay.Language.get('more'),
					}}
					onActiveChange={(page: number) =>
						setProductSearchParams({...searchParams, page})
					}
					onDeltaChange={(pageSize: number) =>
						setProductSearchParams({...searchParams, pageSize})
					}
					totalItems={productsResponse?.totalCount ?? 0}
				/>
			</div>
		</>
	);
};

const MarketplaceProducts: React.FC<MarketplaceProductsProps> = (props) => {
	return (
		<div className="d-flex flex-column h-100 justify-content-between payment-methods-modal-body">
			<ManagementToolbar filterItems={[]} />

			<ProductListView {...props} />
		</div>
	);
};

export {MarketplaceProducts};
