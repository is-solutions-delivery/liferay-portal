/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import DOMPurify from 'isomorphic-dompurify';
import React from 'react';

import {Product} from '../../types';

type ProductCardProps = {
	onClick: (product: Product) => void;
	product: Product;
};

const getCategoryVocabulary = (categories: any[], vocabulary: string) => {
	return categories.filter(
		(category: any) => category?.vocabulary === vocabulary
	);
};

export function ProductCard({onClick, product}: ProductCardProps) {
	const productImage = product?.urlImage;

	const priceModel = product?.productSpecifications?.find(
		(specification) => specification?.specificationKey === 'price-model'
	);

	const categories = getCategoryVocabulary(
		product?.categories,
		'marketplace app category'
	);

	return (
		<div className="border-radius-medium d-flex flex-column justify-content-between mb-0 payment-method-app-search-results-card text-dark text-decoration-none">
			<span
				className="payment-method-app-search-results-card-content"
				onClick={() => onClick(product)}
			>
				<div>
					<div className="align-items-center card-image-title-container d-flex mb-4">
						<div className="image-container mr-2 rounded">
							<img
								className="payment-method-app-search-results-card-image"
								draggable={false}
								src={productImage}
							/>
						</div>

						<div>
							<div className="payment-method-app-search-results-card-title">
								{product?.name}
							</div>

							<div className="payment-method-app-search-results-card-subtitle">
								{product?.catalogName}
							</div>
						</div>
					</div>

					<span
						className="payment-method-app-search-results-card-description"
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(product?.description),
						}}
					/>
				</div>

				<div>
					<span className="font-weight-bold">
						{priceModel?.value}
					</span>

					<div className="d-flex my-2 payment-method-app-search-results-card-category">
						{!!categories?.length && (
							<>
								<span className="payment-method-app-search-results-card-tags">
									{categories[0]?.name}
								</span>

								<span className="payment-method-app-search-results-card-tags">
									{`+ ${categories?.length}`}
								</span>
							</>
						)}
					</div>
				</div>
			</span>

			<ClayButton className="w-100" onClick={() => alert('Test')}>
				{Liferay.Language.get('install')}
			</ClayButton>
		</div>
	);
}
