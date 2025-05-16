/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { useGetAppContext } from '../GetAppContextProvider';
import { getProductBasePriceAndTrial } from '../GetAppOutlet';
import { GetAppStepTypes } from '../enums/GetAppStepTypes';

type ProductHeaderPriceProps = {
	productBasePriceAndTrial: ReturnType<typeof getProductBasePriceAndTrial>;
};

const ProductHeaderPrice: React.FC<any> = ({
	productBasePriceAndTrial,
}) => {
	const [
		{
			currentStep,
			license: { cart, type },
			steps,
		},
	] = useGetAppContext();
	const _currentStep = steps[currentStep];

		if (
			_currentStep.id === GetAppStepTypes.LICENSES ||
			_currentStep.id === GetAppStepTypes.PAYMENT
		) {
			return (
				<span className="price-text-value">
					{cart?.id && type !== 'TRIAL'
						? `${cart.summary.totalFormatted}`
						: `$0`}
				</span>
			);
		}
		if (productBasePriceAndTrial?.basePrice) {
			if (productBasePriceAndTrial?.trialSku) {
				return <span>30-day trial or {productBasePriceAndTrial?.displayPrice ?? productBasePriceAndTrial?.basePrice}</span>;
			}

			return <span>${productBasePriceAndTrial?.displayPrice ?? productBasePriceAndTrial?.basePrice}</span>;
		}

		return <span className="price-text-value">Free</span>;
};

export default ProductHeaderPrice;
