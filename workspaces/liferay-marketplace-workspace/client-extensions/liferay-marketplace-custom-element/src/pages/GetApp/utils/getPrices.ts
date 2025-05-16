/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
    getFilteredPriceListsByCatalogName,
    getPriceEntriesBySkuId,
    getTierPricesByPriceEntry,
} from '../../../utils/api';

export async function getPrices(
    product: DeliveryProduct,
    standardSkuId: number,
    developerSkuId: number
) {
    const catalogName = product.catalogName || '';

    const priceLists = await getFilteredPriceListsByCatalogName(catalogName);

    for (const priceList of priceLists) {
        const entriesStandard = await getPriceEntriesBySkuId(priceList.id, standardSkuId);
        const entriesDeveloper = await getPriceEntriesBySkuId(priceList.id, developerSkuId);

        const [tierPricesStandard, tierPricesDeveloper] = await Promise.all([
            entriesStandard ? getTierPricesByPriceEntry(entriesStandard?.[0].priceEntryId) : [],
            entriesDeveloper ? getTierPricesByPriceEntry(entriesDeveloper?.[0].priceEntryId) : [],
        ]);

        const prices = {
            standard: {
                entries: entriesStandard,
                tierPrices: tierPricesStandard,
            },
            developer: {
                entries: entriesDeveloper,
                tierPrices: tierPricesDeveloper,
            }
        }

        return prices;
    }
}
