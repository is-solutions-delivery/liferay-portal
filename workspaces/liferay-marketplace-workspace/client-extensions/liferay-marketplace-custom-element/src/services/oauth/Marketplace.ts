/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import CreateFilters from '../../core/CreateFilters';
import {
	FilterSchemaOption,
	filterSchema as filterSchemas,
} from '../../schema/filters';
import {downloadFile} from '../../utils/file';
import {MarketplaceSpringBootOAuth2} from './OAuth2Client';

class MarketplaceOAuth2 extends MarketplaceSpringBootOAuth2 {
	async createAccount(data: any): Promise<Account> {
		const formData = new FormData();
		const blob = new Blob([data.accountImage]);

		formData.append('file', blob, data.accountImage.name);

		const payload = {
			customFields: [
				{
					customValue: {
						data: data.emailAddress,
					},
					name: 'Contact Email',
				},
			],
			name: data.accountName,
			postalAddresses: [
				{
					addressCountry: data.billingAddress.country,
					addressLocality: data.billingAddress.city,
					addressRegion: data.billingAddress.regionISOCode ?? '',
					postalCode: data.billingAddress.zip,
					primary: true,
					streetAddressLine1: data.billingAddress.street1,
					streetAddressLine2: data.billingAddress.street2 ?? '',
				},
			],
			taxId: data.taxNumber,
			type: data.type,
		};

		formData.append('account', JSON.stringify({payload}));

		const account = await this.post<Account>(`/account/`, formData);

		return account;
	}

	async downloadOrderReport(
		filter: {
			[key: string]: string;
		},
		filterSchema?: FilterSchemaOption
	) {
		const searchBulider = CreateFilters.createFilter({
			appliedFilter: filter,
			filterSchema: (filterSchemas as any)[filterSchema ?? ''],
		});

		const response = await this.get<Response>(
			`/orders/export?filters=${searchBulider}`,
			{earlyReturn: true}
		);

		await downloadFile('orders.csv', response);
	}

	async taxCalculate(orderId: number): Promise<Order> {
		const order = await this.post<Order>(
			`/tax-calculate/${orderId}`,
			{},
			{earlyReturn: true}
		);

		return order;
	}
}

const marketplaceOAuth2 = new MarketplaceOAuth2('/marketplace');

export default marketplaceOAuth2;
