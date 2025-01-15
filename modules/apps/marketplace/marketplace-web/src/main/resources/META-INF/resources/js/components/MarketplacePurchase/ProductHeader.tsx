/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {MarketplaceProduct} from '../../core/MarketplaceProduct';
import {Product} from '../../types';
import ProductPurchaseHeader from './ProductPurchaseHeader';

type ProductHeaderProps = {
	product: Product;
	projectId?: string;
};

const ProductHeader: React.FC<ProductHeaderProps> = ({product, projectId}) => {
	const marketplaceProduct = new MarketplaceProduct(product);

	const {LATEST_VERSION} = marketplaceProduct.specificationValues;

	return (
		<ProductPurchaseHeader
			image={product?.urlImage}
			rightNode={
				<div className="align-items-end d-flex flex-column price-text">
					<strong className="mr-1">
						{marketplaceProduct.getPrice()}
					</strong>

					<div className="license-tag px-2">
						{marketplaceProduct.getProductResourceLabel()}
					</div>
				</div>
			}
			subsectionTitleLeft="Project Selection"
			subsectionTitleRight={projectId as string}
			subtitle={
				LATEST_VERSION
					? `${LATEST_VERSION} by ${marketplaceProduct.catalogName} `
					: marketplaceProduct.catalogName
			}
			title={product.name}
		/>
	);
};

export default ProductHeader;
