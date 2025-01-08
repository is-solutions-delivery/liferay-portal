
/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { fetch } from 'frontend-js-web';
import { useCallback, useState } from 'react';

import { CartItems } from '../types';

const usePurchase = ({
    accountId,
    marketplaceConfigData,
}: {
    accountId: number;
    marketplaceConfigData: any;
}) => {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>();

    const {
        settings: { channelId },
        url,
    } = marketplaceConfigData || {};

    const createCart = useCallback(async (cartItems: CartItems) => {

        setLoading(true);
        const response = await fetch(
            `${url}/o/headless-commerce-delivery-cart/v1.0/channels/${channelId}/carts`,
            {
                body: JSON.stringify({
                    accountId,
                    cartItems,
                    currencyCode: 'USD',
                    orderTypeExternalReferenceCode:
                        'CLOUDAPP',
                }),
                method: 'POST',
            }
        );

        const data = await response.json();


        setOrder(data);
        setLoading(false)
    }, [accountId, channelId, url]);

    return {
        createCart,
        loading,
        order
    }
}

export default usePurchase