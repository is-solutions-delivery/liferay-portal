/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import useSWR from 'swr';

import HeadlessCommerceDeliveryOrderImpl from '../services/rest/HeadlessCommerceDeliveryOrder';
import {getDeliveryProductById, getProductById} from '../utils/api';
import {useMarketplaceContext} from '../context/MarketplaceContext';
import {Liferay} from '../liferay/liferay';

const useGetProductByOrderId = (orderId?: string) => {
	const {channel} = useMarketplaceContext();

	return useSWR(`/placed-order/${orderId}`, async () => {
		const placedOrder =
			await HeadlessCommerceDeliveryOrderImpl.getPlacedOrder(
				orderId as string
			);

		const productId = placedOrder.placedOrderItems[0].productId;

		const product = await getDeliveryProductById(
			Liferay.CommerceContext?.account?.accountId || 0,
			channel.id,
			productId,
			'attachments'
		);

		return {
			placedOrder,
			product,
		};
	});
};

export default useGetProductByOrderId;
