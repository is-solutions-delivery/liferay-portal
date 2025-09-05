/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import useSWR, {SWRConfiguration} from 'swr';

import HeadlessCommerceAdminCatalog from '../services/rest/HeadlessCommerceAdminCatalog';
import HeadlessCommerceAdminOrder from '../services/rest/HeadlessCommerceAdminOrder';

const useGetAdminProductByOrderId = (
	orderId: string,
	swrOptions?: SWRConfiguration
) => {
	return useSWR(
		`/placed-order/${orderId}`,
		async () => {
			const order = await HeadlessCommerceAdminOrder.getOrder(
				orderId,
				new URLSearchParams({
					nestedFields: 'orderItems,account,billingAddress',
				})
			);

			let product;

			try {
				const sku = await HeadlessCommerceAdminCatalog.getSku(
					order.orderItems[0].skuId
				);

				product = await HeadlessCommerceAdminCatalog.getProduct(
					sku.productId,
					new URLSearchParams({nestedFields: 'productSpecifications'})
				);
			}
			catch (error) {
				console.error('Failed to fetch product:', error);
			}

			return {
				order,
				product,
			};
		},
		swrOptions
	);
};

export default useGetAdminProductByOrderId;
