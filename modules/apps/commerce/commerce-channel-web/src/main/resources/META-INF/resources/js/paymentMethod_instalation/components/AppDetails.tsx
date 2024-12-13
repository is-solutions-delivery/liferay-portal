/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayCard from '@clayui/card';
import ClayIcon from '@clayui/icon';
import ClayModal, {useModal} from '@clayui/modal';
import classNames from 'classnames';
import {format} from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';
import React, {useState} from 'react';

import {Product} from '../types';
import {PAYMENT_VIEW} from './MarketplaceAppsModal';

type AppDetailsProps = {
	backToList: any;
	product: Product;
};

type BodyModal = AppDetailsProps;

const handleCopyLink = async (href: string) => {
	await navigator.clipboard.writeText(href);

	Liferay.Util.openToast({
		message: Liferay.Language.get('copied-link-to-the-clipboard'),
		type: 'success',
	});
};

type PublisherSupportModalProps = {
	onClose: any;
	product: Product;
};

const getCategoryVocabulary = (product: Product, vocabulary: string) => {
	return product.categories.filter(
		(category) => category?.vocabulary === vocabulary
	);
};

const getProductSpecification = (
	product: Product,
	specificationKey: string
) => {
	return product.productSpecifications.find(
		(specification) => specification.specificationKey === specificationKey
	);
};

const PublisherSupportModal = ({
	onClose,
	product,
}: PublisherSupportModalProps) => {
	const publisherWebsiteUrl = getProductSpecification(
		product,
		'publisherwebsiteurl'
	);

	const supportemailaddress = getProductSpecification(
		product,
		'supportemailaddress'
	);

	const supportphone = getProductSpecification(product, 'supportphone');

	const {observer} = useModal({
		onClose,
	});

	return (
		<ClayModal center observer={observer} size="lg">
			<ClayModal.Header>
				{Liferay.Language.get('publisher-support-contact-info')}
			</ClayModal.Header>

			<ClayModal.Body>
				<div className="p-3">
					{product.catalogName && (
						<div className="align-items-center d-flex flex-row mb-4">
							<span className="align-items-center d-flex justify-content-center modal-icon mr-3 rounded-circle">
								{product.urlImage ? (
									<img
										alt="Catalog Thumbnail"
										className="catalog-icon rounded-circle"
										src={product.urlImage}
									/>
								) : (
									<ClayIcon symbol="picture" />
								)}
							</span>

							<div className="d-flex flex-column">
								<h3>{product.catalogName}</h3>
							</div>
						</div>
					)}

					{publisherWebsiteUrl?.value && (
						<div className="align-items-center d-flex flex-row mb-4">
							<span className="align-items-center d-flex justify-content-center modal-icon mr-3 rounded-circle">
								<ClayIcon symbol="globe" />
							</span>

							<div className="d-flex flex-column">
								<span className="text-black-50">
									{Liferay.Language.get(
										'publisher-support-url'
									)}
								</span>

								<a
									className="modal-link"
									href={publisherWebsiteUrl.value}
									target="_blank"
								>
									{publisherWebsiteUrl.value}
								</a>
							</div>
						</div>
					)}

					{supportemailaddress?.value && (
						<div className="align-items-center d-flex flex-row mb-4">
							<span className="align-items-center d-flex justify-content-center modal-icon mr-3 rounded-circle">
								<ClayIcon symbol="envelope-closed" />
							</span>

							<div className="d-flex flex-column">
								<span className="text-black-50">
									{Liferay.Language.get('support-email')}
								</span>

								<a
									className="modal-link"
									href={`mailto:${supportemailaddress.value}`}
									target="_blank"
								>
									{supportemailaddress.value}
								</a>
							</div>
						</div>
					)}

					{supportphone?.value && (
						<div className="align-items-center d-flex flex-row mb-4">
							<span className="align-items-center d-flex justify-content-center modal-icon mr-3 rounded-circle">
								<ClayIcon symbol="phone" />
							</span>

							<div className="d-flex flex-column">
								<span className="text-black-50">
									{Liferay.Language.get('phone')}
								</span>

								<a
									className="modal-link"
									href={`tel:${supportphone}`}
									target="_blank"
								>
									{supportphone}
								</a>
							</div>
						</div>
					)}
				</div>
			</ClayModal.Body>
		</ClayModal>
	);
};

type CardProps = {
	buttons?: {
		href?: string;
		leftIcon?: string;
		onClick?: () => void;
		rightIcon?: string;
		text: string;
	}[];
	description?: any;
	isCommentCard?: boolean;
	title: string;
};

const Card: React.FC<CardProps> = ({
	buttons,
	description,
	isCommentCard,
	title,
}) => (
	<>
		{(description || buttons) && (
			<div>
				<ClayCard className="mb-2 px-3">
					<ClayCard.Body>
						<ClayCard.Description
							className={classNames({
								'card-title-description pb-1': isCommentCard,
							})}
							displayType="title"
						>
							{title.toUpperCase()}
						</ClayCard.Description>

						<ClayCard.Description
							className="mt-3"
							displayType="text"
							truncate={false}
						>
							{description}
						</ClayCard.Description>

						{buttons && (
							<div className="d-flex flex-wrap mt-2">
								{buttons.map((button, index) => (
									<div
										className="align-items-center card-buttons d-flex w-100"
										key={index}
									>
										{button.leftIcon && (
											<ClayIcon
												className="mr-2"
												symbol={button.leftIcon}
											/>
										)}

										<a
											className="align-items-center d-flex justify-content-between text-decoration-none text-reset w-100"
											href={button.href}
											onClick={button.onClick}
											target="_blank"
										>
											<span className="text-truncate">
												{button.text}
											</span>

											{button.rightIcon && (
												<ClayIcon
													className="ml-2"
													symbol={button.rightIcon}
												/>
											)}
										</a>
									</div>
								))}
							</div>
						)}
					</ClayCard.Body>
				</ClayCard>
			</div>
		)}
	</>
);

const Carousel = ({images}: {images: string[]}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleNext = () =>
		setCurrentIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1
		);
	const handlePrev = () =>
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		);
	const handleSelectImage = (index: number) => setCurrentIndex(index);

	return (
		<div>
			<div className="align-items-center carousel d-flex justify-content-center m-0 rounded">
				<div
					className="carousel-border left"
					onClick={handlePrev}
				></div>

				<div className="carousel-images d-flex justify-content-between">
					<img
						alt={`Slide ${currentIndex}`}
						className="carousel-image rounded"
						src={images[currentIndex]}
					/>
				</div>

				<div className="carousel-border right" onClick={handleNext} />
			</div>

			<div className="d-flex justify-content-start overflow-auto">
				{images.map((image, index) => (
					<img
						alt={`Thumbnail ${index}`}
						className={classNames(
							'gallery-image mt-5 mb-2 mx-1 rounded',
							{
								selected: index === currentIndex,
							}
						)}
						key={index}
						onClick={() => handleSelectImage(index)}
						src={image}
					/>
				))}
			</div>
		</div>
	);
};

const BodyModal = ({backToList, product}: BodyModal) => {
	const [publisherSupportModalVisible, setPublisherSupportModalVisible] =
		useState(false);
	const productImage = product.urlImage;

	const carrouselImages = product.images
		.filter((image) => image.priority !== 0)
		.map((image) => image.src);

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
				<a
					className="back-button mb-3"
					onClick={() => backToList(PAYMENT_VIEW.list)}
				>
					<ClayIcon symbol="angle-left" />

					<span className="back-to-list-button-text">
						{Liferay.Language.get('back-to-list')}
					</span>
				</a>

				<div className="align-items-center d-flex justify-content-between">
					<div className="d-flex">
						<div className="app-icon">
							<img
								alt={Liferay.Language.get('app-icon')}
								className="rounded"
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
					<Carousel images={carrouselImages} />

					<div className="mt-4">
						<Card
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
					<Card
						description={product.catalogName}
						title={Liferay.Language.get('developer-name')}
					/>

					<Card
						description={format(
							new Date(product.createDate),
							'MMM dd, yyyy'
						)}
						title={Liferay.Language.get('published-date')}
					/>

					<Card
						description={suportedOfferings?.name}
						title={Liferay.Language.get('supported-offerings')}
					/>

					<Card
						description={liferayVersion?.value}
						title={Liferay.Language.get('supported-versions')}
					/>

					<Card
						description={edition.name}
						title={Liferay.Language.get('edition')}
					/>

					<Card
						description={price}
						title={Liferay.Language.get('price')}
					/>

					<Card
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

					<Card
						buttons={[
							{
								leftIcon: 'link',
								onClick: () => {
									handleCopyLink(
										`https://marketplace-uat.liferay.com/p/${product.urls.en_US}`
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
};

const AppDetails: React.FC<AppDetailsProps> = ({backToList, product}) => {
	return <BodyModal backToList={backToList} product={product} />;
};

export default AppDetails;
