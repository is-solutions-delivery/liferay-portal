/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
export type CustomField = {
	customValue: {
		data: string | string[];
	};
	dataType: string;
	name: string;
};

export type Category = {
	id: number;
	name: string;
	siteId: number;
	title: string;
	vocabulary: string;
};

export type Image = {
	cdnEnabled: boolean;
	cdnURL: string;
	customFields: CustomField[];
	displayDate: string;
	externalReferenceCode: string;
	fileEntryId: number;
	galleryEnabled: boolean;
	id: number;
	options: Record<string, unknown>;
	priority: number;
	src: string;
	tags: string[];
	title: string;
	type: number;
};

export type ProductSpecification = {
	id: number;
	optionCategoryId: number;
	priority: number;
	productId: number;
	specificationGroupKey: string;
	specificationGroupTitle: string;
	specificationId: number;
	specificationKey: string;
	specificationPriority: number;
	specificationTitle: string;
	value: string;
};

export type ProductConfiguration = {
	allowBackOrder: boolean;
	allowedOrderQuantities: number[];
	availabilityEstimateId: number;
	inventoryEngine: string;
	maxOrderQuantity: number;
	minOrderQuantity: number;
	multipleOrderQuantity: number;
};

export type Product = {
	catalogName: string;
	categories: Category[];
	createDate: string;
	customFields: CustomField[];
	description: string;
	expando: Record<string, string>;
	externalReferenceCode: string;
	id: number;
	images: Image[];
	metaDescription: string;
	metaKeyword: string;
	metaTitle: string;
	modifiedDate: string;
	name: string;
	productConfiguration: ProductConfiguration;
	productId: number;
	productSpecifications: ProductSpecification[];
	productType: string;
	shortDescription: string;
	skus: SKU[];
	slug: string;
	tags: string[];
	urlImage: string;
	urls: Record<string, string>;
};

export type APIResponse<T = any> = {
	actions: Record<string, unknown>;
	facets: unknown[];
	items: T[];
	lastPage: number;
	page: number;
	pageSize: number;
	totalCount: number;
};

export type Channel = {
	currencyCode: string;
	externalReferenceCode: string;
	id: number;
	name: string;
	siteGroupId: number;
	type: string;
};

export type SKU = {
	availability: Record<string, unknown>;
	backOrderAllowed: boolean;
	customFields: CustomField[];
	depth: number;
	discontinued: boolean;
	displayDate: string;
	displayDiscountLevels: boolean;
	externalReferenceCode: string;
	gtin: string;
	height: number;
	id: number;
	incomingQuantityLabel: string;
	manufacturerPartNumber: string;
	price: Price;
	productConfiguration: ProductConfiguration;
	productId: number;
	published: boolean;
	purchasable: boolean;
	sku: string;
	skuOptions: SKUOption[];
	skuUnitOfMeasures: unknown[];
	tierPrices: TierPrice[];
	weight: number;
	width: number;
};

export type Price = {
	currency: string;
	price: number;
	priceFormatted: string;
	priceOnApplication: boolean;
};

export type TierPrice = {
	currency: string;
	price: number;
	priceFormatted: string;
	quantity: number;
};

export type SKUOption = {
	key: number;
	price: string;
	priceType: string;
	quantity: string;
	skuOptionId: number;
	skuOptionKey: string;
	skuOptionName: string;
	skuOptionValueId: number;
	skuOptionValueKey: string;
	skuOptionValueNames: string[];
	value: number;
};
