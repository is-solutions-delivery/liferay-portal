/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import {format} from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';
import React, {ReactNode, useState} from 'react';

import {useMarketplaceContext} from '../../MarketplaceContext';
import {MarketplaceProduct} from '../../core/MarketplaceProduct';
import {Product} from '../../types';
import Carousel from './Carousel';
import PublisherSupportModal from './PublisherSupportModal';
import StorefrontDetails from './StorefrontDetails';

type MarketplaceStorefrontProps = {
	onClickBack: () => void;
	primaryButton?: ReactNode;
	product: Product;
};

export async function copyToClipboard(link: string) {
	await navigator.clipboard.writeText(link);

	Liferay.Util.openToast({
		message: Liferay.Language.get('copied-link-to-the-clipboard'),
		type: 'success',
	});
}

export function MarketplaceStorefront({
	onClickBack,
	primaryButton,
	product,
}: MarketplaceStorefrontProps) {
	const {marketplaceConfiguration} = useMarketplaceContext();

	const [publisherSupportModalVisible, setPublisherSupportModalVisible] =
		useState(false);

	const marketplaceProduct = new MarketplaceProduct(product);

	const editions = marketplaceProduct
		.getEditions()
		.map(({name}) => name)
		.join(', ');

	const platformOfferings = marketplaceProduct
		.getPlatformOfferings()
		.map(({name}) => name)
		.join(', ');

	const storefrontItems = [
		{
			title: Liferay.Language.get('developer'),
			value: product.catalogName,
		},
		{
			title: Liferay.Language.get('published-date'),
			value: format(new Date(product.createDate), 'MMM dd, yyyy'),
		},
		{
			title: Liferay.Language.get('supported-offerings'),
			value: platformOfferings,
		},
		{
			title: Liferay.Language.get('supported-versions'),
			value: marketplaceProduct.specificationValues.LATEST_VERSION,
		},
		{
			title: Liferay.Language.get('edition'),
			value: editions,
		},
		{
			title: Liferay.Language.get('price'),
			value: marketplaceProduct.getPrice(),
		},
		{
			title: Liferay.Language.get('help-and-share'),
			value: (
				<div className="d-flex flex-wrap mt-2">
					{[
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
							text: Liferay.Language.get('terms-and-conditions'),
						},
					].map((button, index) => (
						<div
							className="align-items-center card-buttons d-flex w-100"
							key={index}
						>
							<ClayIcon
								className="mr-2"
								symbol={button.leftIcon}
							/>

							<a
								className="align-items-center d-flex justify-content-between text-decoration-none text-reset w-100"
								href={button.href}
								onClick={button.onClick}
								target="_blank"
							>
								<span className="text-truncate">
									{button.text}
								</span>

								<ClayIcon
									className="ml-2"
									symbol={button.rightIcon}
								/>
							</a>
						</div>
					))}
				</div>
			),
		},
		{
			title: Liferay.Language.get('share-link'),
			value: (
				<div className="align-items-center card-buttons d-flex w-100">
					<ClayIcon className="mr-2" symbol="link" />

					<a
						className="align-items-center d-flex justify-content-between text-decoration-none text-reset w-100"
						onClick={() =>
							copyToClipboard(
								`${marketplaceConfiguration.data?.url}/p/${product.urls.en_US}`
							)
						}
						target="_blank"
					>
						<span className="text-truncate">
							{Liferay.Language.get('copy-and-share')}
						</span>
					</a>
				</div>
			),
		},
	];

	const {icon: productTypeIcon, label: productTypeLabel} =
		marketplaceProduct.getProductType();

	return (
		<div className="p-4">
			<div>
				<ClayButton
					className="back-button mb-3"
					displayType="unstyled"
					onClick={onClickBack}
				>
					<ClayIcon symbol="angle-left" />

					<span className="ml-1">
						{Liferay.Language.get('back-to-list')}
					</span>
				</ClayButton>

				<div className="align-items-center d-flex justify-content-between mt-2">
					<div className="d-flex">
						<img
							alt="app-icon"
							className="rounded"
							draggable={false}
							height={70}
							src={marketplaceProduct.productImage}
							width={70}
						/>

						<div className="d-flex flex-column justify-content-center ml-3">
							<h1 className="mb-1">{product.name}</h1>

							<div className="align-items-start categories-container d-flex">
								<div className="align-items-center app-type d-flex px-2 py-1 rounded text-nowrap">
									<ClayIcon
										className="mr-2"
										symbol={productTypeIcon}
									/>

									<span className="text-capitalize">
										{productTypeLabel}
									</span>
								</div>

								<div className="categories-container d-flex flex-wrap">
									{marketplaceProduct
										.getAppCategories()
										.map((category, index) => (
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

					{primaryButton}
				</div>
			</div>

			<div className="card-description-text d-flex h-100 justify-content-between mt-4 w-100">
				<div className="storefront-section">
					<Carousel images={marketplaceProduct.getProductImages()} />

					<div className="mt-4">
						<StorefrontDetails
							highlight
							title={Liferay.Language.get('description')}
						>
							<div
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(
										product.description
									),
								}}
							/>
						</StorefrontDetails>
					</div>
				</div>

				<div className="ml-4 storefront-cards">
					{storefrontItems.map((storefrontItem, index) => (
						<StorefrontDetails
							key={index}
							title={storefrontItem.title}
						>
							{storefrontItem.value}
						</StorefrontDetails>
					))}
				</div>
			</div>

			{publisherSupportModalVisible && (
				<PublisherSupportModal
					onClose={() => setPublisherSupportModalVisible(false)}
					product={product}
				/>
			)}
		</div>
	);
}
