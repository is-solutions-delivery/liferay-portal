/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {cleanup} from '@testing-library/react';

import {MarketplaceProduct} from '../../../src/main/resources/META-INF/resources/js/core/MarketplaceProduct';
import product from '../__mock__/product';

describe('MarketplaceProduct', () => {
	const cloudUserProject = {
		environments: [
			{
				isExtensionEnvironment: true,
				projectId: '1234',
			},
		],
		rootProjectId: '5678',
		rootProjectPlanUsage: {
			cpu: {
				free: 10,
				limit: 10,
				used: 0,
			},
			instance: {
				free: 10,
				limit: 10,
				used: 0,
			},
			memory: {
				free: 10000,
				limit: 10000,
				used: 0,
			},
		},
	};

	let marketplaceProduct;

	beforeEach(() => {
		jest.useFakeTimers();
		marketplaceProduct = new MarketplaceProduct(product);
	});

	afterEach(() => {
		cleanup();

		jest.clearAllTimers();
		jest.restoreAllMocks();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it('will return specification values correctly', () => {
		const expectedSpecifications = {
			CPU: '0',
			LATEST_VERSION: 'Version 1.0',
			PRICE_MODEL: 'Free',
			PUBLISHER_WEBSITE_URL: 'https://comehereforhelp.com/docs',
			RAM: '0',
			SUPPORT_EMAIL_ADDRESS: 'support@liferay.com',
			SUPPORT_PHONE: '999-999-999',
			TYPE: 'cloud',
		};

		expect(marketplaceProduct.specificationValues).toEqual(
			expectedSpecifications
		);
	});

	it('will return the create date', () => {
		expect(marketplaceProduct.createDate).toBe('2025-01-01');
	});

	it('will return the catalog name', () => {
		expect(marketplaceProduct.catalogName).toBe('Liferay Labs');
	});

	it('will return the friendly URL', () => {
		expect(marketplaceProduct.friendlyURL).toBe('friendly-url');
	});

	it('will filter purchasable SKUs', () => {
		const purchasableSKUs = marketplaceProduct.getPurchasableSKUs();

		expect(purchasableSKUs).toHaveLength(1);
		expect(purchasableSKUs[0].price.priceFormatted).toBe('$10.00');
	});

	it('will return formatted product images', () => {
		expect(marketplaceProduct.getProductImages()).toEqual(['image1.png']);
	});

	it('will return product price', () => {
		marketplaceProduct = new MarketplaceProduct({
			...product,
			productSpecifications: [
				{specificationKey: 'price-model', value: 'paid'},
			],
		});

		expect(marketplaceProduct.getPrice()).toBe('$10.00');
	});

	it('will return product price free', () => {
		expect(marketplaceProduct.getPrice()).toBe('Free');
	});

	it('will return app categories', () => {
		const categories = marketplaceProduct.getAppCategories();

		expect(categories).toHaveLength(2);
		expect(categories[0].name).toEqual('app category 1');
	});

	it('will return editions', () => {
		const editions = marketplaceProduct.getEditions();

		expect(editions).toHaveLength(2);
		expect(editions[0].name).toBe('edition 1');
	});

	it('will return platform offerings', () => {
		const offerings = marketplaceProduct.getPlatformOfferings();

		expect(offerings).toHaveLength(2);
		expect(offerings[0].name).toBe('platform offering 1');
	});

	it('will return product type with icon and label', () => {
		const productType = marketplaceProduct.getProductType();
		expect(productType).toEqual({
			icon: 'cloud',
			label: 'cloud App',
			type: 'cloud',
		});
	});

	it('will return product type with icon and label without type', () => {
		marketplaceProduct = new MarketplaceProduct({
			...product,
			productSpecifications: [
				{specificationKey: 'price-model', value: 'free'},
			],
		});

		expect(marketplaceProduct.getProductType()).toEqual({
			icon: 'cog',
			label: ' App',
			type: '',
		});
	});

	it('will return product resource label', () => {
		expect(marketplaceProduct.getProductResourceLabel()).toBe(
			'0CPUs, 0GB RAM'
		);
	});

	it('will return the product image', () => {
		expect(marketplaceProduct.productImage).toBe(
			'https://liferay.com/liferay-icon.png'
		);
	});

	it('testing getCloudResourceLabel', () => {
		expect(marketplaceProduct.getCloudResourceLabel(cloudUserProject)).toBe(
			`1 environment, 10 CPUs, 10 GB RAM`
		);
		cloudUserProject.rootProjectPlanUsage.cpu.free = 0;
		cloudUserProject.rootProjectPlanUsage.memory.free = 0;

		expect(marketplaceProduct.getCloudResourceLabel(cloudUserProject)).toBe(
			`1 environment, 0 CPUs, 0 GB RAM`
		);

		expect(marketplaceProduct.getCloudResourceLabel(false)).toBe('');
	});

	it('testing hasEnoughResources', () => {
		expect(marketplaceProduct.hasEnoughResources(cloudUserProject)).toBe(
			true
		);

		expect(marketplaceProduct.hasEnoughResources(false)).toBe(false);

		cloudUserProject.rootProjectPlanUsage.instance.free = 0;

		expect(marketplaceProduct.hasEnoughResources(cloudUserProject)).toBe(
			false
		);

		cloudUserProject.rootProjectPlanUsage.memory.free = -1;
		cloudUserProject.rootProjectPlanUsage.instance.free = 1;

		expect(marketplaceProduct.hasEnoughResources(cloudUserProject)).toBe(
			false
		);
	});
});
