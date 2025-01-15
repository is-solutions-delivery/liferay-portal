/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import React, {useState} from 'react';

import {useMarketplaceContext} from '../../MarketplaceContext';
import {Product} from '../../types';
import {MarketplaceProducts} from '../MarketplaceProducts';
import {MarketplacePurchase} from '../MarketplacePurchase';
import {MarketplaceStorefront} from '../MarketplaceStorefront';
import {Step} from './MarketplaceModalView';

type MarketplaceModalAppsViewProps = {
	setStep: React.Dispatch<Step>;
	step: Step;
};

const MarketplaceModalAppsView: React.FC<MarketplaceModalAppsViewProps> = ({
	setStep,
	step,
}) => {
	const {marketplaceConfiguration} = useMarketplaceContext();

	const [product, setProduct] = useState<Product>();

	if (step === Step.INSTALLATION) {
		return (
			<MarketplacePurchase
				onClickCancel={() => setStep(Step.PRODUCT_LIST_VIEW)}
				product={product as Product}
				projectId={
					marketplaceConfiguration.data?.settings?.cloudProject
				}
			/>
		);
	}

	if (step === Step.PRODUCT_LIST_VIEW) {
		return (
			<MarketplaceProducts
				onClickProduct={(product) => {
					setProduct(product);

					setStep(Step.STOREFRONT);
				}}
			>
				{(product) => (
					<ClayButton
						className="w-100"
						onClick={() => {
							setProduct(product);

							setStep(Step.INSTALLATION);
						}}
					>
						{Liferay.Language.get('install')}
					</ClayButton>
				)}
			</MarketplaceProducts>
		);
	}

	if (step === Step.STOREFRONT) {
		return (
			<MarketplaceStorefront
				onClickBack={() => setStep(Step.PRODUCT_LIST_VIEW)}
				primaryButton={
					<ClayButton
						className="ml-auto mt-3 rounded"
						onClick={() => setStep(Step.INSTALLATION)}
					>
						{Liferay.Language.get('install')}
					</ClayButton>
				}
				product={product as Product}
			/>
		);
	}

	return null;
};

export {MarketplaceModalAppsView};
