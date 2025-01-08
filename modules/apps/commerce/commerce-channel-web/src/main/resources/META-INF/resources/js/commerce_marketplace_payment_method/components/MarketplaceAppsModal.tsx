/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayModal from '@clayui/modal';
import {Observer} from '@clayui/modal/lib/types';
import {
	MarketplaceProducts,
	MarketplaceStorefront,
	Product,
	useMarketplaceAuthorization,
	useMarketplaceProducts,
} from '@liferay/marketplace-web';
import React, {useEffect, useState} from 'react';

export enum Step {
	STOREFRONT,
	PRODUCT,
}

type MarketplaceAppsModalProps = {
	data: NonNullable<ReturnType<typeof useMarketplaceAuthorization>['data']>;
	observer: Observer;
	open: boolean;
};

const MarketplaceAppsModal: React.FC<MarketplaceAppsModalProps> = ({
	data,
	observer,
	open,
}) => {
	const [step, setStep] = useState(Step.PRODUCT);
	const [selectedApp, setSelectedApp] = useState<Product>();

	const {loading, pagination, productsResponse, search, sort} =
		useMarketplaceProducts(data);

	const items = productsResponse?.items;

	useEffect(() => {
		if (!open) {
			setStep(Step.PRODUCT);
		}
	}, [open]);

	if (!open) {
		return null;
	}

	return (
		<ClayModal center observer={observer} size="full-screen">
			<ClayModal.Header>
				{Liferay.Language.get('add-from-marketplace')}
			</ClayModal.Header>

			<ClayModal.Body className="m-0 p-0">
				{step === Step.PRODUCT && (
					<MarketplaceProducts
						loading={loading}
						onClickProduct={(product) => {
							setSelectedApp(product);

							setStep(Step.STOREFRONT);
						}}
						pagination={pagination}
						products={items}
						searchQuery={search.searchQuery}
						setSearchQuery={search.setSearchQuery}
						sort={sort}
					/>
				)}

				{step === Step.STOREFRONT && (
					<MarketplaceStorefront
						data={data}
						onClickBack={() => setStep(Step.PRODUCT)}
						product={selectedApp as Product}
					/>
				)}
			</ClayModal.Body>
		</ClayModal>
	);
};

export default MarketplaceAppsModal;
