/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import {format} from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';
import React, {useState} from 'react';

import {useMarketplaceAuthorization} from '../../hooks/useMarketplaceAuthorization';
import {Product} from '../../types';
import {getCategoryVocabulary, getProductSpecification} from '../../util';
import Carousel from './Carousel';
import DetailsCard from './DetailCard';
import PublisherSupportModal from './PublisherSupportModal';

import '../../styles/product_storefront.scss';

type MarketplaceStorefrontProps = {
	data: NonNullable<ReturnType<typeof useMarketplaceAuthorization>>['data'];
	onClickBack: any;
	product: Product;
};

const handleCopyLink = async (href: string) => {
	await navigator.clipboard.writeText(href);

	Liferay.Util.openToast({
		message: Liferay.Language.get('copied-link-to-the-clipboard'),
		type: 'success',
	});
};

export function MarketplaceStorefront({
	data,
	onClickBack,
	product,
}: MarketplaceStorefrontProps) {
	const [publisherSupportModalVisible, setPublisherSupportModalVisible] =
		useState(false);

	const productImage = product.urlImage;

	const [suportedOfferings] = getCategoryVocabulary(
		product,
		'marketplace liferay platform offering'
	);

	const categories = getCategoryVocabulary(
		product,
		'marketplace app category'
	);

	const [edition] = getCategoryVocabulary(product, 'marketplace edition');

	const liferayVersion = getProductSpecification(product, 'liferay-version');

	const productType = getProductSpecification(product, 'type');

	const sku = product?.skus.filter((sku) =>
		sku?.skuOptions.find(
			(option) => option.skuOptionValueKey === 'standard'
		)
	);

	const price = sku.length
		? sku[0]?.price?.priceFormatted
		: Liferay.Language.get('free');

	return (
		<div className="p-4">
			<div>
				<span className="back-button mb-3" onClick={onClickBack}>
					<ClayIcon symbol="angle-left" />

					<span className="ml-1">
						{Liferay.Language.get('back-to-list')}
					</span>
				</span>

				<div className="align-items-center d-flex justify-content-between mt-2">
					<div className="d-flex">
						<div className="app-icon">
							<img
								alt={Liferay.Language.get('app-icon')}
								className="rounded"
								draggable={false}
								src={productImage}
							/>
						</div>

						<div className="d-flex flex-column justify-content-center ml-3">
							<h1 className="mb-1">{product.name}</h1>

							<div className="align-items-start categories-container d-flex">
								<div className="align-items-center app-type d-flex px-2 py-1 rounded text-nowrap">
									<ClayIcon
										className="mr-2"
										symbol={
											productType?.value === 'dxp'
												? 'site-template'
												: 'cloud'
										}
									/>

									{productType?.value === 'dxp'
										? Liferay.Language.get('dxp-app')
										: Liferay.Language.get('cloud-app')}
								</div>

								<div className="categories-container d-flex flex-wrap">
									{categories?.map((category, index) => (
										<span
											className="category-tag px-2 py-1 text-nowrap"
											key={index}
										>
											{category.name}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>

					<div>
						<ClayButton className="ml-auto mt-3 rounded">
							{Liferay.Language.get('install')}
						</ClayButton>
					</div>
				</div>
			</div>

			<div className="card-description-text d-flex h-100 justify-content-between mt-4 w-100">
				<div className="carousel-section">
					<Carousel
						images={product.images
							.filter((image) => image.priority !== 0)
							.map((image) => image.src)}
					/>

					<div className="mt-4">
						<DetailsCard
							description={
								<div
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(
											product.description
										),
									}}
								/>
							}
							isCommentCard
							title="Description"
						/>
					</div>
				</div>

				{publisherSupportModalVisible && (
					<PublisherSupportModal
						onClose={() => setPublisherSupportModalVisible(false)}
						product={product}
					/>
				)}

				<div className="additional-cards ml-4">
					<DetailsCard
						description={product.catalogName}
						title={Liferay.Language.get('developer')}
					/>

					<DetailsCard
						description={format(
							new Date(product.createDate),
							'MMM dd, yyyy'
						)}
						title={Liferay.Language.get('published-date')}
					/>

					<DetailsCard
						description={suportedOfferings?.name}
						title={Liferay.Language.get('supported-offerings')}
					/>

					<DetailsCard
						description={liferayVersion?.value}
						title={Liferay.Language.get('supported-versions')}
					/>

					<DetailsCard
						description={edition.name}
						title={Liferay.Language.get('edition')}
					/>

					<DetailsCard
						description={price}
						title={Liferay.Language.get('price')}
					/>

					<DetailsCard
						buttons={[
							{
								leftIcon: 'envelope-closed',
								onClick: () =>
									setPublisherSupportModalVisible(true),
								rightIcon: 'angle-right',
								text: Liferay.Language.get('publisher-support'),
							},
							{
								href: 'https://www.liferay.com/en/legal/marketplace-terms-of-service',
								leftIcon: 'document',
								rightIcon: 'angle-right',
								text: Liferay.Language.get(
									'terms-and-condition'
								),
							},
						]}
						title={Liferay.Language.get('help-and-share')}
					/>

					<DetailsCard
						buttons={[
							{
								leftIcon: 'link',
								onClick: () => {
									handleCopyLink(
										`${data?.url}/p/${product.urls.en_US}`
									);
								},
								text: Liferay.Language.get('copy-and-share'),
							},
						]}
						title={Liferay.Language.get('share-link')}
					/>
				</div>
			</div>
		</div>
	);
}
