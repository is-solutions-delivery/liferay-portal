/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useState} from 'react';

import {useMarketplaceContext} from '../../MarketplaceContext';
import {Product} from '../../types';
import {MarketplacePurchaseBody, States} from './MarketplacePurchaseBody';
import ProductHeader from './ProductHeader';

type MarketplacePurchaseProps = {
	onClickCancel: () => void;
	product: Product;
	projectId?: string;
};

export function MarketplacePurchase(props: MarketplacePurchaseProps) {
	const [state, setState] = useState(States.CONFIRM_INSTALLATION);
	const {marketplaceRest} = useMarketplaceContext();

	async function onClickInstall() {
		setState(States.IN_PROGRESS);

		try {
			const order = await marketplaceRest.createCart(props.product);

			await marketplaceRest.consoleProvisioningOrder(order);

			setState(States.SUCCESS);
		}
		catch (error) {
			console.error(error);

			setState(States.ERROR);
		}
	}

	return (
		<div className="marketplace-purchase">
			<div className="bg-light border d-flex flex-column m-4 rounded-lg">
				<ProductHeader
					product={props.product}
					projectId={props.projectId}
				/>
			</div>

			<MarketplacePurchaseBody
				{...props}
				onClickInstall={onClickInstall}
				state={state}
			/>
		</div>
	);
}
